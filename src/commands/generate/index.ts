import {Command, Flags} from '@oclif/core'
import inquirer from "inquirer"
import * as fcl from "@onflow/fcl"
import { exec } from "child_process"
import {logger} from "../../utils/logger"
import {tags} from "../../utils/bcp47-tags"
import {readFiles, File} from "../../utils/read-files"
import {writeFile} from "../../utils/write-file"
import {question as selectCDCFiles} from "../../questions/select-cdc-files"
import {question as selectInteractionType} from "../../questions/interaction-type"
import {question as inputInterfaceID} from "../../questions/interface-id"
import {question as inputMessages} from "../../questions/messages"
import {question as inputAuthor} from "../../questions/author"
import {question as inputArguments} from "../../questions/arguments"
import {question as inputVersion} from "../../questions/version"
import {generateTemplate} from '../../utils/generate-template'
import {generatePins} from "../../questions/generate-pins"

export default class Generate extends Command {
  static description = 'Generate transaction templates from .cdc files.'

  static examples = [
    `$ flowplate generate ./src/cadence`,
  ]

  static flags = {}

  static args = [{
    name: 'path',
    description: 'Path to a folder or individual CDC file.',
    required: true,
  }]

  async run(): Promise<void> {
    const {argv, args, flags} = await this.parse(Generate)
    const { path } = args

    let files: File[] = await readFiles(path)

    const flowJSONFiles = await readFiles("flow.json")
    const flowJSON = flowJSONFiles[0] ? JSON.parse(flowJSONFiles[0].content) : null

    // If more than one file found, ask which files they want to generate templates for.
    files = await selectCDCFiles(files)

    let lastUsedAuthorAddr;

    for (let i = 0; i < files.length; i++) {
      let file = files[i]

      logger.default(`\n🌱 [Template ${i + 1} / ${files.length}] ⚙️  Generating template for ${file.path}\n\n----${file.path}----`)
      logger.default(file.content)
      logger.default(`----\n`)

      let detectedScript = file.content.match(/pub fun main/g)
      let detectedTransaction = !detectedScript && file.content.match(/transaction/g)

      let dependencies = await generatePins(file, flowJSON)

      let type = await selectInteractionType(file)

      logger.default("\n🌱 Collecting template messages")
      logger.default("🌱 A title and description are recommended\n")
      let messages = await inputMessages(file)

      logger.default("\n🌱 Collecting argument messages\n")
      let args = await inputArguments(file)

      let iface: string = await inputInterfaceID(file)
      // let author = await inputAuthor(file, flowJSON)
      // let author = null
      let cadence = file?.content

      let version = await inputVersion(file)

      // let dependencies = null

      let template = generateTemplate({
        type,
        iface,
        // author,
        version,
        messages,
        cadence,
        dependencies,
        args,
      })

      logger.default("\n🌱 Template: ", JSON.stringify(template, null, 2), "\n")

      let filePathParts = file.path.split(".")
      filePathParts.push("template")
      filePathParts.push("json")
      let templateFilePath = filePathParts.join(".")

      await writeFile(templateFilePath, JSON.stringify(template, null, 2))
    }
    
    this.log(`Generate cmd run, path=${argv[0]}`)
  }
}
