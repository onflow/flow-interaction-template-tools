import inquirer from "inquirer"
import * as fcl from "@onflow/fcl"
import {iAuditMonad} from "../../utils/audit/audit-monad"

export async function question(templateMonad: iAuditMonad) {
  const flowJSONNetworks = templateMonad.flowJSON?.networks
  const networks = Object.keys(flowJSONNetworks)

  let signerNetwork = ""
  let accessNodeAPI = ""
  await inquirer
  .prompt([
    {
      type: "list",
      message: "Select network the auditor account exists on:",
      name: "nw",
      choices: networks.map(nw => ({
        name: nw,
        value: nw,
      })),
      validate(answer) {
        if (networks[answer]) return "Unavailable network"
        return true
      },
    },
  ])
  .then(answers => {
    signerNetwork = answers.nw
    accessNodeAPI = flowJSONNetworks[answers.nw]
  })

  await fcl.config().put("accessNode.api", accessNodeAPI)

  return {
    ...templateMonad,
    accessNodeAPI,
    signerNetwork,
  }
}
