# 将fabroc-sample/bin下的二进制文件添加到CLI路径中（）

# 执行命令：source ./peerSet.sh 1 7051
# 1-7051 2-8051 3-6051

# ORG是组织号，PORT是组织端口
# 第一种设置默认和参数的方式
#ORG="$1"
#PORT="$2"
#: ${ORG:="1"}
#: ${PORT:="7051"}

# 第二种设置方式
ORG=${1:-"1"}
PORT=${2:-"7051"}

# 指定路径来使用bin下的可执行工具peer
export PATH=${PWD}/../bin:$PATH
# 设置FABRIC_CFG_PATH指向bin中的core.yaml文件
export FABRIC_CFG_PATH=${PWD}/../config/

# 配置需要查询的组织的环境变量
export CORE_PEER_TLS_ENABLED=true
export CORE_PEER_LOCALMSPID="Org${ORG}MSP"
export CORE_PEER_TLS_ROOTCERT_FILE=${PWD}/organizations/peerOrganizations/org${ORG}.gov.com/peers/peer0.org${ORG}.gov.com/tls/ca.crt
export CORE_PEER_MSPCONFIGPATH=${PWD}/organizations/peerOrganizations/org${ORG}.gov.com/users/Admin@org${ORG}.gov.com/msp
export CORE_PEER_ADDRESS=localhost:${PORT}


function peerSet(){
  echo peerSet ${1} ${2} ${3}
  
  # 指定路径来使用bin下的可执行工具peer
  export PATH=${3}/../bin:$PATH
  # 设置FABRIC_CFG_PATH指向bin中的core.yaml文件
  export FABRIC_CFG_PATH=${3}/../config/

  # 配置需要查询的组织的环境变量
  export CORE_PEER_TLS_ENABLED=true
  export CORE_PEER_LOCALMSPID="Org${1}MSP"
  export CORE_PEER_TLS_ROOTCERT_FILE=${3}/organizations/peerOrganizations/org${1}.gov.com/peers/peer0.org${1}.gov.com/tls/ca.crt
  export CORE_PEER_MSPCONFIGPATH=${3}/organizations/peerOrganizations/org${1}.gov.com/users/Admin@org${1}.gov.com/msp
  export CORE_PEER_ADDRESS=localhost:${2}
}

