import {Command, Flags} from "@oclif/core"
import {logger} from "../../utils/logger"
import {readFiles} from "../../utils/file/read-files"
import {writeFile} from "../../utils/file/write-file"
import {catalogSplashTitle} from "../../utils/splashscreen"
import { setupMainnet, setupTestnet } from "../../utils/catalog/setup-fcl"
import { generateInteractionTemplate } from "../../utils/catalog/generate-interaction-template"
import { getAllCollections } from "../../utils/catalog/catalog-helpers"
import { generateSavePath } from "../../utils/catalog/generate-save-path"

export default class Catalog extends Command {
  static description = "Generate Interaction Templates from NFT Catalog.";

  static examples = ["$ flowplate catalog"];

  static flags = {
    flowJsonPath: Flags.string({
      char: "f",
      summary: "Path to a flow.json configuration file.",
    }),
  };

  static args = [
    {
      name: "path",
      description: "Path to a folder to store the generated Interaction Templates.",
      required: true,
    },
    {
      name: "projects",
      description: "List of NFT Catalog projects to generate Interaction Templates for (default all)",
      required: false,
    },
    {
      name: "skip_projects",
      description: "List of NFT Catalog projects to skip when generating Interaction Templates (default none)",
      required: false,
    }
  ];


  async run(): Promise<void> {
    const {flags, args} = await this.parse(Catalog)
    const {projects: _projects, path, skip_projects: _skip_projects} = args

    const projects = _projects ? _projects.split(",") : []
    const skip_projects = _skip_projects ? _skip_projects.split(",") : []

    catalogSplashTitle()

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
    let identifiers: string[] = projects // Project identifiers
    let transactions: string[] = ["CollectionInitialization", "StorefrontListItem", "StorefrontBuyItem", "StorefrontRemoveItem"] // Transaction types

    if (identifiers.length === 0) {
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
    }
    
    try {
      for (const identifier of identifiers) {
        for (const transaction of transactions) {
            logger.default(
              `\n⚙️  Generating template for ${identifier} ${transaction}`,
            )

            const existing_templates = await readFiles(`${generateSavePath(path)}${identifier}/${identifier}-${transaction}*.template.json`)

            if (existing_templates.length > 0) {
              logger.default(
                `\n⚙️  Skipping ${identifier} ${transaction}, already exists`,
              )
              continue;
            }

            if (skip_projects.includes(identifier)) continue;

            const interaction_template: any = await new Promise(async (res, rej) => {
              const timeoutId = setTimeout(() => {
                logger.default(
                  `\n⚙️  Aborting ${identifier} ${transaction}, exceeded time`,
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
                await writeFile(`${generateSavePath(path)}${identifier}/${identifier}-${transaction}-${"mainnet"}.template.json`, JSON.stringify(interaction_template.mainnet, null, 2))  
              }
              if (interaction_template.testnet) {
                await writeFile(`${generateSavePath(path)}${identifier}/${identifier}-${transaction}-${"testnet"}.template.json`, JSON.stringify(interaction_template.testnet, null, 2))
              }
            } else {
              GENERATED[identifier] = {
                ...GENERATED?.[identifier],
                [transaction]: {
                  interaction_template
                }
              }
              await writeFile(`${generateSavePath(path)}${identifier}/${identifier}-${transaction}.template.json`, JSON.stringify(interaction_template, null, 2))
            }
            logger.default(
              `\n⚙️  Saved template!`,
            )
        }
      }

      await writeFile(`${generateSavePath(path)}catalog-manifest.json`, JSON.stringify(GENERATED, null, 2))

      logger.default(
        `\n🌱 Saved templates to ${`${generateSavePath(path)}catalog-manifest.json`}\n`,
      )
    } catch (e) {
      logger.error(
        `\n❌ An error occurred.\n`,
      )
    }
  }
}
