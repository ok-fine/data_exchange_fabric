package main

import (
	"fmt"
	// "github.com/hyperledger/fabric-sdk-go/internal/github.com/hyperledger/fabric/protoutil"
)

// // UnmarshalTransaction 从某个交易的payload来解析它
// func UnmarshalTransaction(payloadRaw []byte) (string, error) {
// 	//解析成payload
// 	payload, err := protoutil.UnmarshalPayload(payloadRaw)
// 	if err != nil {
// 		return nil, err
// 	}
// 	return payload, nil
// }

func main() {
   var a string
   a := "eyJzdGF0dXMiOjIwMCwicGF5bG9hZCI6InN1Y2Nlc3MifQ=="
   fmt.Println(a)
}