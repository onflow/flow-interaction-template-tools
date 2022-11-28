import inquirer from "inquirer"
import chalk from "chalk"
import {CliUx} from "@oclif/core"
import * as fcl from "@onflow/fcl"
import {logger} from "../../utils/logger"
import crypto from "node:crypto"
import {File} from "../../utils/file/read-files"
import {iTemplateMonad} from "../../utils/template/template-monad"

async function inputAddressForNetwork(
  file: File,
  address: string,
  network: string,
): Promise<string> {
  return inquirer
  .prompt([
    {
      type: "input",
      message: `[${file?.path}] Input account address for ${address} on ${network}:`,
      name: "address",
      validate(answer) {
        if (fcl.sansPrefix(answer).length !== 16) {
          return "Account address must be 16 characters long"
        }

        return true
      },
    },
  ])
  .then(answers => {
    return fcl.withPrefix(answers.address)
  })
}

function findImports(cadence: string, isPlaceholder = false): iport[] {
  const iports: iport[] = []

  if (!cadence || cadence === "") return iports

  const importsReg = /import \w+ from 0x\w+/g
  const fileImports = cadence.match(importsReg) || []
  for (const fileImport of fileImports) {
    const importReg = /import (\w+) from (0x\w+)/g
    const fileiport = importReg.exec(fileImport)
    if (fileiport) {
      if (isPlaceholder) {
        iports.push({
          addressPlaceholder: fileiport[2],
          contractName: fileiport[1],
        })
      } else {
        iports.push({
          address: fileiport[2],
          contractName: fileiport[1],
        })
      }
    }
  }

  return iports
}

interface iport {
  addressPlaceholder?: string;
  address?: string;
  contractName: string;
  contract?: string;
}

interface iAddressMemo {
  [network: string]: any;
}

interface iPins {
  [importPlaceholder: string]: any;
}

export async function generatePins(
  templateMonad: iTemplateMonad,
): Promise<iTemplateMonad> {
  logger.default("\n🌱 Generating dependency pins\n")

  const file: File = templateMonad.file

  const addressMemo: iAddressMemo = {
    testnet: {},
    mainnet: {},
    emulator: {},
  }

  const pins: iPins = {}

  const iports: iport[] = findImports(file?.content, true)

  if (iports.length === 0)
    return {
      ...templateMonad,
      dependencies: pins,
    }

  const networks = ["testnet", "mainnet", "emulator"]

  for (const network of networks) {
    let doesUserWantToGeneratePin = true
    await inquirer
    .prompt([
      {
        type: "confirm",
        message: `[${file?.path}] Do you want to generate a dependency pin for ${network}? :`,
        name: "toGeneratePin",
        default: true,
        validate(answer) {
          return true
        },
      },
    ])
    .then(answers => {
      doesUserWantToGeneratePin = answers.toGeneratePin
    })
    if (!doesUserWantToGeneratePin) continue

    logger.default(`🌱 Generating dependency pin for ${network}...`)

    const networkIports: iport[] = iports.map(iport => ({
      ...iport,
    }))

    for (const iport of networkIports) {
      if (!addressMemo?.[network]?.[iport?.addressPlaceholder!]) {
        const addr = await inputAddressForNetwork(
          file,
          iport?.addressPlaceholder!,
          network,
        )
        addressMemo[network][iport?.addressPlaceholder!] = addr
      }

      iport.address = addressMemo[network][iport?.addressPlaceholder!]
    }

    const accessNodeAPI = templateMonad?.flowJSON?.networks?.[network]
    await fcl.config().put("accessNode.api", accessNodeAPI)

    const latestSealedBlock = await fcl.block({sealed: true})
    const latestBlockPin = latestSealedBlock?.height

    for (const networkIport of networkIports) {
      CliUx.ux.action.start(
        chalk.whiteBright.bold(
          `🌱 Generating dependency pin for ${networkIport.addressPlaceholder} on ${network}`,
        ),
      )

      const pin = await fcl.InteractionTemplateUtils.generateDependencyPin({
        address: networkIport.address!,
        contractName: networkIport.contractName!,
        blockHeight: latestBlockPin,
      })

      pins[networkIport.addressPlaceholder!] = {
        ...(pins?.[networkIport.addressPlaceholder!] || []),
        [networkIport.contractName!]: {
          ...(pins?.[networkIport.addressPlaceholder!]?.[
            networkIport.contractName!
          ] || []),
          [network]: {
            address: networkIport.address!,
            contract: networkIport.contractName!,
            fq_address: `A.${networkIport.address!}.${networkIport.contractName!}`,
            pin: pin,
            pin_block_height: latestBlockPin,
          },
        },
      }

      CliUx.ux.action.stop(chalk.whiteBright.bold("Generated!"))
    }
  }

  return {
    ...templateMonad,
    dependencies: pins,
  }
}
