// @ts-nocheck
import {setupMainnet, setupTestnet, Network} from "./setup-fcl"
import { getGeneratedTransaction } from "./catalog-helpers"
import * as FLIX_Generators from "@onflow/interaction-template-generators"
import { TRANSACTION_TYPES } from "./interaction-template-utils"

async function constructInteractionTemplate(
  cadence: string,
  transaction: string,
  identifier: string,
  networks: string[],
  addressByNetwork: Map<string, Map<Network, string>> = new Map()
) {
  const template = await FLIX_Generators.template({
      iface: "",
      type: TRANSACTION_TYPES[transaction] ?
      TRANSACTION_TYPES[transaction].type : null,
      cadence: cadence,
      messages: FLIX_Generators.messages(
          TRANSACTION_TYPES[transaction] ?
              TRANSACTION_TYPES[transaction].messages({ projectName: identifier }) : []
      ),
      args: FLIX_Generators.args(
          TRANSACTION_TYPES[transaction] ?
              TRANSACTION_TYPES[transaction].args({ projectName: identifier }) : []
      ),
      dependencies: FLIX_Generators.dependencies(
          Array.from(addressByNetwork).map(([key, value]) => 
              FLIX_Generators.dependency({
                  addressPlaceholder: `0x${key}`,
                  contracts: [
                      FLIX_Generators.dependencyContract({
                          contractName: key,
                          networks: networks.map(networkOption => 
                              FLIX_Generators.dependencyContractByNetwork({
                                  network: networkOption,
                                  contractName: key,
                                  address: value.get(networkOption),
                                  fqAddress: `A.${value.get(networkOption)}.${key}`,
                              }, (() => {
                                  if (networkOption === "testnet") {
                                      return { "node": "https://rest-testnet.onflow.org" }
                                  }
                                  if (networkOption === "mainnet") {
                                      return { "node": "https://rest-mainnet.onflow.org" }
                                  }
                                  return {}
                              })())
                          )
                      })
                  ]
              })
          )
      )
  })

  return template
}

export async function generateInteractionTemplate(transaction: string, identifier: string, networks: string[]) {
  try {
    // { network: address }
    const cadenceByNetwork: Map<Network, string> = new Map()
    // { placholder: { network: address } }
    const addressByNetwork: Map<string, Map<Network, string>> = new Map()

    let cadence: any = {}
    for (let network of networks) {
        if (network === "mainnet") {
          setupMainnet()
        }
        if (network === "testnet") {
          setupTestnet()
        }
      
        const res = await getGeneratedTransaction(transaction, identifier, "flow", "0x9999999999999999") 
        if (!res) {
          cadence[network] = null
          continue;
        }

        cadenceByNetwork.set(network, res)
        
        let importsReg = /import (\w|,| )+ from 0x\w+/g
        let fileImports = res.match(importsReg) || []

        for (let fileImport of fileImports) {
            let placeholder: string = ""
            let address: string = ""

            fileImport = fileImport.replace(
                /(?:import ((\w|,| )+) from (0x\w+))/g, 
                function(...args: any[]) { 
                    address = args[3]
                    placeholder = args[1]
                    return "import " + placeholder + " from 0x" + placeholder
                }
            )

            addressByNetwork.get(placeholder) ?
                addressByNetwork.get(placeholder)?.set(network, address)
                :
                addressByNetwork.set(placeholder, (new Map()).set(network, address))
        }

        cadence[network] = res.replace(
            /(?:import ((\w|,| )+) from (0x\w+))/g, 
            function(...args: any[]) { 
                return "import " + args[1] + " from 0x" + args[1]
            }
        )
    }
    
    // Check if cadence bodies match
    let doCadenceBodiesMatch = true
    addressByNetwork.forEach((networkAddresses) => {
        let count = 0
        for (const networkAddress of networkAddresses) count++
        if (count !== networks.length) doCadenceBodiesMatch = false
    })

    if (!doCadenceBodiesMatch) {
      let mainnetTemplate = null
      let testnetTemplate = null
      if (cadence["mainnet"]) {
        const mainnetAddressByNetwork = new Map([...addressByNetwork].filter(([a, b]) => b.get("mainnet") !== undefined))  
        mainnetTemplate = await constructInteractionTemplate(cadence.mainnet, transaction, identifier, ["mainnet"], mainnetAddressByNetwork)
      }
      if (cadence["testnet"]){
        const testnetAddressByNetwork = new Map([...addressByNetwork].filter(([a, b]) => b.get("testnet") !== undefined))
        testnetTemplate = await constructInteractionTemplate(cadence.testnet, transaction, identifier, ["testnet"], testnetAddressByNetwork)
      }
      
      return {
        "mainnet": mainnetTemplate,
        "testnet": testnetTemplate
      }
    }

    const template = await constructInteractionTemplate(cadence.mainnet, transaction, identifier, networks, addressByNetwork)

    return template
  } catch (e) {
    return null
  }
}