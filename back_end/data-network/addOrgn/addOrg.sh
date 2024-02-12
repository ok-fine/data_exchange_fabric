#!/bin/bash
#
# Copyright IBM Corp All Rights Reserved
#
# SPDX-License-Identifier: Apache-2.0
#

# This script extends the Hyperledger Fabric test network by adding
# adding a third organization to the network
#

# prepending $PWD/../bin to PATH to ensure we are picking up the correct binaries
# this may be commented out to resolve installed version of tools if desired
export PATH=${PWD}/../../bin:${PWD}:$PATH
export FABRIC_CFG_PATH=${PWD}
export VERBOSE=false


. ../scripts/utils.sh

# Print the usage message
function printHelp () {
  echo "Usage: "
  echo "  addOrg.sh up|down|generate [-c <channel name>] [-t <timeout>] [-d <delay>] [-f <docker-compose-file>] [-s <dbtype>]"
  echo "  addOrg.sh -h|--help (print this message)"
  echo "    <mode> - one of 'up', 'down', or 'generate'"
  echo "      - 'up' - add orgn to the sample network. You need to bring up the test network and create a channel first."
  echo "      - 'down' - bring down the test network and orgn nodes"
  echo "      - 'generate' - generate required certificates and org definition"
  echo "    -n <organization number> - the organicaztion number you want to add (defaults to \"4\")"
  echo "    -p <ca port> - the organization's ca port (defaults to \"11054\")"
  echo "    -c <channel name> - test network channel name (defaults to \"mychannel\")"
  echo "    -ca <use CA> -  Use a CA to generate the crypto material"
  echo "    -t <timeout> - CLI timeout duration in seconds (defaults to 10)"
  echo "    -d <delay> - delay duration in seconds (defaults to 3)"
  echo "    -s <dbtype> - the database backend to use: goleveldb (default) or couchdb"
  echo "    -verbose - verbose mode"
  echo
  echo "Typically, one would first generate the required certificates and "
  echo "genesis block, then bring up the network. e.g.:"
  echo
  echo "    addOrg.sh generate"
  echo "	addOrg.sh generate -n 4 -p 11054"
  echo "	addOrg.sh up"
  echo "	addOrg.sh up -c mychannel -s couchdb"
  echo "	addOrg.sh down"
  echo
  echo "Taking all defaults:"
  echo "	addOrg.sh up"
  echo "	addOrg.sh down"
}

# We use the cryptogen tool to generate the cryptographic material
# (x509 certs) for the new org.  After we run the tool, the certs will
# be put in the organizations folder with org1 and org2

# Create Organziation crypto material using cryptogen or CAs
function generateOrgn() {
  # Create crypto material using cryptogen
  if [ "$CRYPTO" == "cryptogen" ]; then
    which cryptogen
    if [ "$?" -ne 0 ]; then
      fatalln "cryptogen tool not found. exiting"
    fi
    infoln "Generating certificates using cryptogen tool"

    infoln "Creating Org${ORG} Identities"

    set -x
    cryptogen generate --config=../organizations/cryptogen/org${ORG}-crypto.yaml --output="../organizations"
    res=$?
    { set +x; } 2>/dev/null
    if [ $res -ne 0 ]; then
      fatalln "Failed to generate certificates..."
    fi

  fi

  # Create crypto material using Fabric CA
  if [ "$CRYPTO" == "Certificate Authorities" ]; then
    fabric-ca-client version > /dev/null 2>&1
    if [[ $? -ne 0 ]]; then
      echo "ERROR! fabric-ca-client binary not found.."
      echo
      echo "Follow the instructions in the Fabric docs to install the Fabric Binaries:"
      echo "https://hyperledger-fabric.readthedocs.io/en/latest/install.html"
      exit 1
    fi

    infoln "Generating certificates using Fabric CA"
    docker-compose -f $COMPOSE_FILE_CA_ORGN up -d 2>&1

    . fabric-ca/registerEnroll.sh
#    . ../organizations/fabric-ca/registerEnroll.sh
#    createOrgn ${ORG} ${PORT}

    sleep 10

    infoln "Creating Org${ORG} Identities"
    createOrg4

  fi

  infoln "Generating CCP files for Org${ORG}"
  ./ccp-generate.sh
}

# Generate channel configuration transaction
function generateOrgnDefinition() {
  which configtxgen
  if [ "$?" -ne 0 ]; then
    fatalln "configtxgen tool not found. exiting"
  fi
  infoln "Generating Org${ORG} organization definition"
  export FABRIC_CFG_PATH=$PWD
  set -x
  configtxgen -printOrg Org${ORG}MSP > ../organizations/peerOrganizations/org${ORG}.gov.com/org${ORG}.json
  res=$?
  { set +x; } 2>/dev/null
  if [ $res -ne 0 ]; then
    fatalln "Failed to generate Org${ORG} organization definition..."
  fi
}

function OrgnUp () {
  # start org${ORG} nodes
  if [ "${DATABASE}" == "couchdb" ]; then
    docker-compose -f $COMPOSE_FILE_ORGN -f $COMPOSE_FILE_COUCH_ORGN up -d 2>&1
  else
    docker-compose -f $COMPOSE_FILE_ORGN up -d 2>&1
  fi
  if [ $? -ne 0 ]; then
    fatalln "ERROR !!!! Unable to start Org${ORG} network"
  fi
}

# Generate the needed certificates, the genesis block and start the network.
function addOrgn () {
  # If the test network is not up, abort
  if [ ! -d ../organizations/ordererOrganizations ]; then
    fatalln "ERROR: Please, run ./network.sh up createChannel first."
  fi

  # generate artifacts if they don't exist
  if [ ! -d "../organizations/peerOrganizations/org${ORG}.gov.com" ]; then
    generateOrgn
    generateOrgnDefinition
  fi

  infoln "Bringing up Org${ORG} peer"
  OrgnUp

  # Use the CLI container to create the configuration transaction needed to add
  # Org${ORG} to the network
  infoln "Generating and submitting config tx to add Org${ORG}"
  docker exec cli ./scripts/orgn-scripts/updateChannelConfig.sh $CHANNEL_NAME $CLI_DELAY $CLI_TIMEOUT $VERBOSE
  if [ $? -ne 0 ]; then
    fatalln "ERROR !!!! Unable to create config tx"
  fi

  infoln "Joining Org${ORG} peers to network"
  docker exec cli ./scripts/orgn-scripts/joinChannel.sh $CHANNEL_NAME $CLI_DELAY $CLI_TIMEOUT $VERBOSE
  if [ $? -ne 0 ]; then
    fatalln "ERROR !!!! Unable to join Org${ORG} peers to network"
  fi
}

# Tear down running network
function networkDown () {
    cd ..
    ./network.sh down
}

ORG="4"
PORT=11054

# Using crpto vs CA. default is cryptogen
CRYPTO="cryptogen"
# timeout duration - the duration the CLI should wait for a response from
# another container before giving up
CLI_TIMEOUT=10
#default for delay
CLI_DELAY=3
# channel name defaults to "mychannel"
CHANNEL_NAME="datachannel"
# use this as the docker compose couch file
COMPOSE_FILE_COUCH_ORGN=docker/docker-compose-couch-org4.yaml
# use this as the default docker-compose yaml definition
COMPOSE_FILE_ORGN=docker/docker-compose-org4.yaml
# certificate authorities compose file
COMPOSE_FILE_CA_ORGN=docker/docker-compose-ca-org4.yaml
# database
DATABASE="leveldb"

# Parse commandline args

## Parse mode
if [[ $# -lt 1 ]] ; then
  printHelp
  exit 0
else
  MODE=$1
  shift
fi

# parse flags

while [[ $# -ge 1 ]] ; do
  key="$1"
  case $key in
  -n )
    ORG="$2"
    shift
    ;;
  -p )
    PORT="$2"
    shift
    ;;
  -h )
    printHelp
    exit 0
    ;;
  -c )
    CHANNEL_NAME="$2"
    shift
    ;;
  -ca )
    CRYPTO="Certificate Authorities"
    ;;
  -t )
    CLI_TIMEOUT="$2"
    shift
    ;;
  -d )
    CLI_DELAY="$2"
    shift
    ;;
  -s )
    DATABASE="$2"
    shift
    ;;
  -verbose )
    VERBOSE=true
    shift
    ;;
  * )
    errorln "Unknown flag: $key"
    printHelp
    exit 1
    ;;
  esac
  shift
done


# Determine whether starting, stopping, restarting or generating for announce
if [ "$MODE" == "up" ]; then
  infoln "Adding org${ORG} to channel '${CHANNEL_NAME}' with '${CLI_TIMEOUT}' seconds and CLI delay of '${CLI_DELAY}' seconds and using database '${DATABASE}'"
  echo
elif [ "$MODE" == "down" ]; then
  EXPMODE="Stopping network"
elif [ "$MODE" == "generate" ]; then
  EXPMODE="Generating certs and organization definition for Org${ORG}"
else
  printHelp
  exit 1
fi

#Create the network using docker compose
if [ "${MODE}" == "up" ]; then
  addOrgn
elif [ "${MODE}" == "down" ]; then ## Clear the network
  networkDown
elif [ "${MODE}" == "generate" ]; then ## Generate Artifacts
  generateOrgn
  generateOrgnDefinition
else
  printHelp
  exit 1
fi
