echo NodeOUs:
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
  OrganizationalUnitIdentifier: orderer' > try.yaml
