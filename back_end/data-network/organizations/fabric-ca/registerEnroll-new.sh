#!/bin/bash

#========================================= org${1} =========================================
# createOrg orgnum port
# 1-7054
function createOrg() {
  if [ $# -lt 2]; then
    infoln "Please input the org number and ca port";
    exit 0
  fi

  infoln "Enrolling the CA admin"
  mkdir -p organizations/peerOrganizations/org${1}.gov.com/

  export FABRIC_CA_CLIENT_HOME=${PWD}/organizations/peerOrganizations/org${1}.gov.com/

  set -x
  fabric-ca-client enroll -u https://admin:adminpw@localhost:${2} --caname ca-org${1} --tls.certfiles "${PWD}/organizations/fabric-ca/org${1}/tls-cert.pem"
  { set +x; } 2>/dev/null

  echo 'NodeOUs:
  Enable: true
  ClientOUIdentifier:
    Certificate: cacerts/localhost-'${2}'-ca-org'${1}'.pem
    OrganizationalUnitIdentifier: client
  PeerOUIdentifier:
    Certificate: cacerts/localhost-'${2}'-ca-org'${1}'.pem
    OrganizationalUnitIdentifier: peer
  AdminOUIdentifier:
    Certificate: cacerts/localhost-'${2}'-ca-org'${1}'.pem
    OrganizationalUnitIdentifier: admin
  OrdererOUIdentifier:
    Certificate: cacerts/localhost-'${2}'-ca-org'${1}'.pem
    OrganizationalUnitIdentifier: orderer' > "${PWD}/organizations/peerOrganizations/org${1}.gov.com/msp/config.yaml"

  infoln "Registering peer0"
  set -x
  fabric-ca-client register --caname ca-org${1} --id.name peer0 --id.secret peer0pw --id.type peer --tls.certfiles "${PWD}/organizations/fabric-ca/org${1}/tls-cert.pem"
  { set +x; } 2>/dev/null

  infoln "Registering user"
  set -x
  fabric-ca-client register --caname ca-org${1} --id.name user1 --id.secret user1pw --id.type client --tls.certfiles "${PWD}/organizations/fabric-ca/org${1}/tls-cert.pem"
  { set +x; } 2>/dev/null

  infoln "Registering the org admin"
  set -x
  fabric-ca-client register --caname ca-org${1} --id.name org${1}admin --id.secret org${1}adminpw --id.type admin --tls.certfiles "${PWD}/organizations/fabric-ca/org${1}/tls-cert.pem"
  { set +x; } 2>/dev/null

  infoln "Generating the peer0 msp"
  set -x
  fabric-ca-client enroll -u https://peer0:peer0pw@localhost:${2} --caname ca-org${1} -M "${PWD}/organizations/peerOrganizations/org${1}.gov.com/peers/peer0.org${1}.gov.com/msp" --csr.hosts peer0.org${1}.gov.com --tls.certfiles "${PWD}/organizations/fabric-ca/org${1}/tls-cert.pem"
  { set +x; } 2>/dev/null

  cp "${PWD}/organizations/peerOrganizations/org${1}.gov.com/msp/config.yaml" "${PWD}/organizations/peerOrganizations/org${1}.gov.com/peers/peer0.org${1}.gov.com/msp/config.yaml"

  infoln "Generating the peer0-tls certificates"
  set -x
  fabric-ca-client enroll -u https://peer0:peer0pw@localhost:${2} --caname ca-org${1} -M "${PWD}/organizations/peerOrganizations/org${1}.gov.com/peers/peer0.org${1}.gov.com/tls" --enrollment.profile tls --csr.hosts peer0.org${1}.gov.com --csr.hosts localhost --tls.certfiles "${PWD}/organizations/fabric-ca/org${1}/tls-cert.pem"
  { set +x; } 2>/dev/null

  cp "${PWD}/organizations/peerOrganizations/org${1}.gov.com/peers/peer0.org${1}.gov.com/tls/tlscacerts/"* "${PWD}/organizations/peerOrganizations/org${1}.gov.com/peers/peer0.org${1}.gov.com/tls/ca.crt"
  cp "${PWD}/organizations/peerOrganizations/org${1}.gov.com/peers/peer0.org${1}.gov.com/tls/signcerts/"* "${PWD}/organizations/peerOrganizations/org${1}.gov.com/peers/peer0.org${1}.gov.com/tls/server.crt"
  cp "${PWD}/organizations/peerOrganizations/org${1}.gov.com/peers/peer0.org${1}.gov.com/tls/keystore/"* "${PWD}/organizations/peerOrganizations/org${1}.gov.com/peers/peer0.org${1}.gov.com/tls/server.key"

  mkdir -p "${PWD}/organizations/peerOrganizations/org${1}.gov.com/msp/tlscacerts"
  cp "${PWD}/organizations/peerOrganizations/org${1}.gov.com/peers/peer0.org${1}.gov.com/tls/tlscacerts/"* "${PWD}/organizations/peerOrganizations/org${1}.gov.com/msp/tlscacerts/ca.crt"

  mkdir -p "${PWD}/organizations/peerOrganizations/org${1}.gov.com/tlsca"
  cp "${PWD}/organizations/peerOrganizations/org${1}.gov.com/peers/peer0.org${1}.gov.com/tls/tlscacerts/"* "${PWD}/organizations/peerOrganizations/org${1}.gov.com/tlsca/tlsca.org${1}.gov.com-cert.pem"

  mkdir -p "${PWD}/organizations/peerOrganizations/org${1}.gov.com/ca"
  cp "${PWD}/organizations/peerOrganizations/org${1}.gov.com/peers/peer0.org${1}.gov.com/msp/cacerts/"* "${PWD}/organizations/peerOrganizations/org${1}.gov.com/ca/ca.org${1}.gov.com-cert.pem"

  infoln "Generating the user msp"
  set -x
  fabric-ca-client enroll -u https://user1:user1pw@localhost:${2} --caname ca-org${1} -M "${PWD}/organizations/peerOrganizations/org${1}.gov.com/users/User1@org${1}.gov.com/msp" --tls.certfiles "${PWD}/organizations/fabric-ca/org${1}/tls-cert.pem"
  { set +x; } 2>/dev/null

  cp "${PWD}/organizations/peerOrganizations/org${1}.gov.com/msp/config.yaml" "${PWD}/organizations/peerOrganizations/org${1}.gov.com/users/User1@org${1}.gov.com/msp/config.yaml"
  
  #  Copy the connection profiles so they are in the correct organizations.
  #  是否使用ca注册均可使用相同的名称指定以下pem文件，在ca注册下，pem文件名为“cert.pem”
  cp "${PWD}/organizations/peerOrganizations/org${1}.gov.com/users/User1@org${1}.gov.com/msp/signcerts/"* "${PWD}/organizations/peerOrganizations/org${1}.gov.com/users/User1@org${1}.gov.com/msp/signcerts/User1@org${1}.gov.com-cert.pem"
  cp "${PWD}/organizations/peerOrganizations/org${1}.gov.com/users/User1@org${1}.gov.com/msp/keystore/"* "${PWD}/organizations/peerOrganizations/org${1}.gov.com/users/User1@org${1}.gov.com/msp/keystore/priv_sk"

  infoln "Generating the org admin msp"
  set -x
  fabric-ca-client enroll -u https://org${1}admin:org${1}adminpw@localhost:${2} --caname ca-org${1} -M "${PWD}/organizations/peerOrganizations/org${1}.gov.com/users/Admin@org${1}.gov.com/msp" --tls.certfiles "${PWD}/organizations/fabric-ca/org${1}/tls-cert.pem"
  { set +x; } 2>/dev/null

  cp "${PWD}/organizations/peerOrganizations/org${1}.gov.com/msp/config.yaml" "${PWD}/organizations/peerOrganizations/org${1}.gov.com/users/Admin@org${1}.gov.com/msp/config.yaml"
}


#========================================= Orderer =========================================
function createOrderer() {
  infoln "Enrolling the CA admin"
  mkdir -p organizations/ordererOrganizations/gov.com

  export FABRIC_CA_CLIENT_HOME=${PWD}/organizations/ordererOrganizations/gov.com

  set -x
  fabric-ca-client enroll -u https://admin:adminpw@localhost:9054 --caname ca-orderer --tls.certfiles "${PWD}/organizations/fabric-ca/ordererOrg/tls-cert.pem"
  { set +x; } 2>/dev/null

  echo 'NodeOUs:
  Enable: true
  ClientOUIdentifier:
    Certificate: cacerts/localhost-9054-ca-orderer.pem
    OrganizationalUnitIdentifier: client
  PeerOUIdentifier:
    Certificate: cacerts/localhost-9054-ca-orderer.pem
    OrganizationalUnitIdentifier: peer
  AdminOUIdentifier:
    Certificate: cacerts/localhost-9054-ca-orderer.pem
    OrganizationalUnitIdentifier: admin
  OrdererOUIdentifier:
    Certificate: cacerts/localhost-9054-ca-orderer.pem
    OrganizationalUnitIdentifier: orderer' > "${PWD}/organizations/ordererOrganizations/gov.com/msp/config.yaml"

  infoln "Registering orderer"
  set -x
  fabric-ca-client register --caname ca-orderer --id.name orderer --id.secret ordererpw --id.type orderer --tls.certfiles "${PWD}/organizations/fabric-ca/ordererOrg/tls-cert.pem"
  { set +x; } 2>/dev/null

  infoln "Registering the orderer admin"
  set -x
  fabric-ca-client register --caname ca-orderer --id.name ordererAdmin --id.secret ordererAdminpw --id.type admin --tls.certfiles "${PWD}/organizations/fabric-ca/ordererOrg/tls-cert.pem"
  { set +x; } 2>/dev/null

  infoln "Generating the orderer msp"
  set -x
  fabric-ca-client enroll -u https://orderer:ordererpw@localhost:9054 --caname ca-orderer -M "${PWD}/organizations/ordererOrganizations/gov.com/orderers/orderer.gov.com/msp" --csr.hosts orderer.gov.com --csr.hosts localhost --tls.certfiles "${PWD}/organizations/fabric-ca/ordererOrg/tls-cert.pem"
  { set +x; } 2>/dev/null

  cp "${PWD}/organizations/ordererOrganizations/gov.com/msp/config.yaml" "${PWD}/organizations/ordererOrganizations/gov.com/orderers/orderer.gov.com/msp/config.yaml"

  infoln "Generating the orderer-tls certificates"
  set -x
  fabric-ca-client enroll -u https://orderer:ordererpw@localhost:9054 --caname ca-orderer -M "${PWD}/organizations/ordererOrganizations/gov.com/orderers/orderer.gov.com/tls" --enrollment.profile tls --csr.hosts orderer.gov.com --csr.hosts localhost --tls.certfiles "${PWD}/organizations/fabric-ca/ordererOrg/tls-cert.pem"
  { set +x; } 2>/dev/null

  cp "${PWD}/organizations/ordererOrganizations/gov.com/orderers/orderer.gov.com/tls/tlscacerts/"* "${PWD}/organizations/ordererOrganizations/gov.com/orderers/orderer.gov.com/tls/ca.crt"
  cp "${PWD}/organizations/ordererOrganizations/gov.com/orderers/orderer.gov.com/tls/signcerts/"* "${PWD}/organizations/ordererOrganizations/gov.com/orderers/orderer.gov.com/tls/server.crt"
  cp "${PWD}/organizations/ordererOrganizations/gov.com/orderers/orderer.gov.com/tls/keystore/"* "${PWD}/organizations/ordererOrganizations/gov.com/orderers/orderer.gov.com/tls/server.key"

  mkdir -p "${PWD}/organizations/ordererOrganizations/gov.com/orderers/orderer.gov.com/msp/tlscacerts"
  cp "${PWD}/organizations/ordererOrganizations/gov.com/orderers/orderer.gov.com/tls/tlscacerts/"* "${PWD}/organizations/ordererOrganizations/gov.com/orderers/orderer.gov.com/msp/tlscacerts/tlsca.gov.com-cert.pem"

  mkdir -p "${PWD}/organizations/ordererOrganizations/gov.com/msp/tlscacerts"
  cp "${PWD}/organizations/ordererOrganizations/gov.com/orderers/orderer.gov.com/tls/tlscacerts/"* "${PWD}/organizations/ordererOrganizations/gov.com/msp/tlscacerts/tlsca.gov.com-cert.pem"

  infoln "Generating the admin msp"
  set -x
  fabric-ca-client enroll -u https://ordererAdmin:ordererAdminpw@localhost:9054 --caname ca-orderer -M "${PWD}/organizations/ordererOrganizations/gov.com/users/Admin@gov.com/msp" --tls.certfiles "${PWD}/organizations/fabric-ca/ordererOrg/tls-cert.pem"
  { set +x; } 2>/dev/null

  cp "${PWD}/organizations/ordererOrganizations/gov.com/msp/config.yaml" "${PWD}/organizations/ordererOrganizations/gov.com/users/Admin@gov.com/msp/config.yaml"
}
