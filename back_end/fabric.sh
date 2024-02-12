set -e

# don't rewrite paths for Windows Git Bash users
export MSYS_NO_PATHCONV=1

starttime=$(date +%s)
dirname=${PWD} # 当前脚本所在路径

function printStartHelp() {
  printf "pliease choose one of the command to start \n";
  printf "  ./network.sh <command> \n"
  printf "    command: \n"
  printf "      - up       : start the network with 3 organizations and 2 peers per each \n"
  printf "      - deployCC : deploy the chaincode 'datanet' on the channel \n"
  printf "      - down     : stop the network \n"
  printf "\n"
  printf "  ./network.sh deploy <flag> \n"
  printf "    flag : \n"
  printf "      -ccn     : <string> chaincode name \n"
  printf "      -ccv     : <int>    chaincode version \n"
  printf "      -ccs     : <int>    chaincode sequence <int>\n"
  printf "      -cccg    : <string> The fully qualified path to the collection JSON file including the file namez(指定集合定义文件的路径) \n\n"
#  printf "      - peerSet  : set comamnd peer to use \n"
}

function start() {

  if [ ! -d ~/.hfc-key-store/ ]; then
    mkdir ~/.hfc-key-store/
  fi
  
  if [ ! -d ~${dirname}/application/rolepem ]; then
    mkdir ${dirname}/application/rolepem
  fi

  # launch network; create channel and join peer to channel
  cd ${dirname}/data-network

  ./network.sh up createChannel -ca -s couchdb
  
  if [ "${GOOGLE_OPEN}" == "true" ]; then
    open -n /Applications/Google\ Chrome.app/ --args --disable-web-security --user-data-dir=/Users/weijieyang/Documents/MyChromeDevUserData
  fi
}

function stop() {
  # launch network; create channel and join peer to channel
  cd ${dirname}/data-network
  
#  stop network
  ./network.sh down
  
#  remove the wallet
  cd ${dirname}/application
  
  if [ -d ./wallet ]; then
    rm -r wallet/
  fi
  
  if [ -d ./rolepem ]; then
    rm -r ./rolepem/
  fi

  
#  remove the docker images
#  docker rm -f $(docker ps -aq)
#  docker rmi -f $(docker images | grep "dev\|none\|test-vp\|peer[0-9]-" | awk '{print $3}')
  #docker-compose -f docker-compose.yaml down --volumes

  # remove the local state
  rm -f ~/.hfc-key-store/*

}

function deployCC() {
  cd data-network
  ./network.sh deployCC -ccn ${CC_NAME} -ccp ../chaincode/${CC_NAME}/ -ccl ${CC_SRC_LANGUAGE} -cci ${CC_INIT_FCN} -ccv ${CC_VERSION} -ccs ${CC_SEQUENCE}
#  ./network.sh deployCC -ccn dataasset -ccp ../chaincode/dataasset/ -ccl javascript
}

GOOGLE_OPEN="false"

# chaincode name defaults to "NA"
CC_NAME="dataasset"
# endorsement policy defaults to "NA". This would allow chaincodes to use the majority default policy.
CC_END_POLICY="NA"
# collection configuration defaults to "NA"
CC_COLL_CONFIG="NA"
# chaincode init function defaults to "NA"
CC_INIT_FCN="NA"
# chaincode language defaults to "NA"
CC_SRC_LANGUAGE="javascript"
# Chaincode version
CC_VERSION="1.0"
# Chaincode definition sequence
CC_SEQUENCE=1


if [[ $# -lt 1 ]] ; then
  printStartHelp
  exit 0
#elif [[ $# -eq 3 ]]; then
#  CHOOSE=$1
#  ORG=$2
#  PORT=$3
else
  CHOOSE=$1
  shift
fi

# parse flags
while [[ $# -ge 1 ]] ; do
  key="$1"
  case $key in
  -g )
    GOOGLE_OPEN="true"
#    shift
    ;;
  -ccn )
    CC_NAME="$2"
    shift
    ;;
  -ccv )
    CC_VERSION="$2"
    shift
    ;;
  -ccs )
    CC_SEQUENCE="$2"
    shift
    ;;
  -cci )
    CC_INIT_FCN="$2"
    shift
    ;;
  -ccep )
    CC_END_POLICY="$2"
    shift
    ;;
  -cccg )
    CC_COLL_CONFIG="$2"
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

if [ "${CHOOSE}" == "up" ]; then
  stop
  start
elif [ "${CHOOSE}" == "deployCC" ]; then
  deployCC
elif [ "${CHOOSE}" == "down" ]; then
  stop
#elif [ "${CHOOSE}" == "peerSet" ]; then
#  peer ${ORG} ${PORT}
else
  printStartHelp
  exit 0
fi


## Now launch the CLI container in order to install, instantiate chaincode
## and prime the ledger with our 10 drug catches
#docker-compose -f ./docker-compose.yml up -d cli
#
#docker exec -e "CORE_PEER_LOCALMSPID=Org1MSP" -e "CORE_PEER_MSPCONFIGPATH=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/org1.gov.com/users/Admin@org1.gov.com/msp" cli peer chaincode install -n drug-app -v 1.0 -p github.com/drug-app
#docker exec -e "CORE_PEER_LOCALMSPID=Org1MSP" -e "CORE_PEER_MSPCONFIGPATH=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/org1.gov.com/users/Admin@org1.gov.com/msp" cli peer chaincode instantiate -o orderer.gov.com:7050 -C mychannel -n drug-app -v 1.0 -c '{"Args":[""]}' -P "OR ('Org1MSP.member','Org2MSP.member')"
#sleep 10
#docker exec -e "CORE_PEER_LOCALMSPID=Org1MSP" -e "CORE_PEER_MSPCONFIGPATH=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/org1.gov.com/users/Admin@org1.gov.com/msp" cli peer chaincode invoke -o orderer.gov.com:7050 -C mychannel -n drug-app -c '{"function":"initLedger","Args":[""]}'

#printf "\nTotal execution time : $(($(date +%s) - starttime)) secs ...\n\n"
#printf "\nStart with the registerAdmin.js, then registerUser.js, then server.js\n\n"
