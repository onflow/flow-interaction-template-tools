import inquirer from "inquirer"

export async function question(flowJSON: any) {
  const flowJSONNetworks = flowJSON?.networks
  const networks = Object.keys(flowJSONNetworks)

  let network = ""
  await inquirer.prompt([
    {
      type: "list",
      message: "Select network to verify audit on:",
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
  ]).then(answers => {
    network = answers.nw
  })

  return network
}
