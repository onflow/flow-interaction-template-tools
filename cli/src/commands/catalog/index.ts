import {Command, Flags} from "@oclif/core"
import inquirer from "inquirer"
import * as fcl from "@onflow/fcl"
import {exec} from "node:child_process"
import {logger} from "../../utils/logger"
import {tags} from "../../utils/bcp47-tags"
import {readFiles, File} from "../../utils/file/read-files"
import {writeFile} from "../../utils/file/write-file"
import {generateSplashTitle} from "../../utils/splashscreen"
import { getGeneratedTransaction, getSupportedGeneratedTransactions } from "../../utils/catalog/catalog-helpers"
import { setupMainnet, setupTestnet } from "../../utils/catalog/setup-fcl"
import { generateInteractionTemplate } from "../../utils/catalog/generate-interaction-template"
import { getAllCollections } from "../../utils/catalog/catalog-helpers"
import e from "express"

export default class Catalog extends Command {
  static description = "Generate Interaction Templates from NFT Catalog.";

  static examples = ["$ flowplate catalog"];

  static flags = {
    flowJsonPath: Flags.string({
      char: "f",
      summary: "Path to a flow.json configuration file.",
    }),
  };

  static args = [];

  async run(): Promise<void> {
    const {flags} = await this.parse(Catalog)
    // const {path} = args

    generateSplashTitle()

    logger.warn(
      "⚠️  Warning: The FLIX CLI is currently in early alpha. Please report any bugs by opening an issue here: https://github.com/onflow/flow-interaction-template-tools/issues/new",
    )

    const flowJSONFiles = await readFiles(flags.flowJsonPath || "flow.json")
    const flowJSON = flowJSONFiles[0] ?
      JSON.parse(flowJSONFiles[0].content) :
      null

    if (flowJSON === null) {
      logger.error("❌ Error: No flow.json file found.")
      return
    }

    const GENERATED: any = {}

    const networks: string[] = ["mainnet", "testnet"] // Networks
    let identifiers: string[] = [] // Project identifiers
    let transactions: string[] = ["CollectionInitialization", "StorefrontListItem", "StorefrontBuyItem", "StorefrontRemoveItem"] // Transaction types
    // let transactions: string[] = ["CollectionInitialization"] // Transaction types

    const skip_identifiers = [
      "RTLStoreItem",
      "Gamisodes",
      "TokndSwaychain",
      "SwaychainToknd",
      "YoungBoysBern",
      "RaptaIconCollection",
      "NiftoryDapperMainnet",
      "MoMMAgame"
    ]

    for (const network of networks) {
      if (network === "mainnet") {
        setupMainnet()
      }
      if (network === "testnet") {
        setupTestnet()
      }
      const _identifiers = await getAllCollections()

      identifiers = identifiers.concat(Object.keys(_identifiers))
    }
    
    try {
      for (const identifier of identifiers) {
        for (const transaction of transactions) {
            logger.default(
              `\n⚙️ Generating template for ${identifier} ${transaction}`,
            )

            const existing_templates = await readFiles(`./catalog/${identifier}/${identifier}-${transaction}*.template.json`)

            if (existing_templates.length > 0) {
              logger.default(
                `\n⚙️ Skipping ${identifier} ${transaction}, already exists`,
              )
              continue;
            }

            if (skip_identifiers.includes(identifier)) continue;

            const interaction_template: any = await new Promise(async (res, rej) => {
              const timeoutId = setTimeout(() => {
                logger.default(
                  `\n⚙️ Aborting ${identifier} ${transaction}, exceeded time`,
                )
                res(null)
              }, 120000)
              const interaction_template = await generateInteractionTemplate(transaction, identifier, networks)  
              clearTimeout(timeoutId)
              res(interaction_template)
            })

            if (!interaction_template) continue;

            logger.default(
              `\n⚙️ Generated template!`,
            )

            if (!interaction_template?.f_type) {
              GENERATED[identifier] = {
                ...GENERATED?.[identifier],
                [transaction]: {
                  ["mainnet"]: interaction_template.mainnet,
                  ["testnet"]: interaction_template.testnet,
                }
              }
              if (interaction_template.mainnet) {
                await writeFile(`./catalog/${identifier}/${identifier}-${transaction}-${"mainnet"}.template.json`, JSON.stringify(interaction_template.mainnet, null, 2))  
              }
              if (interaction_template.testnet) {
                await writeFile(`./catalog/${identifier}/${identifier}-${transaction}-${"testnet"}.template.json`, JSON.stringify(interaction_template.testnet, null, 2))
              }
            } else {
              GENERATED[identifier] = {
                ...GENERATED?.[identifier],
                [transaction]: {
                  interaction_template
                }
              }
              await writeFile(`./catalog/${identifier}/${identifier}-${transaction}.template.json`, JSON.stringify(interaction_template, null, 2))
            }
            logger.default(
              `\n⚙️ Saved template!`,
            )
        }
      }

      await writeFile("./catalog/catalog-manifest.json", JSON.stringify(GENERATED, null, 2))

      logger.default(
        `\n🌱 Saved templates to ./catalog-manifest.json\n`,
      )
    } catch (e) {
      // console.log("ERROR: ", e)

    }
  }
}
