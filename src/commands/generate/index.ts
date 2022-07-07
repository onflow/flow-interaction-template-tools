import {Command, Flags} from '@oclif/core'
import inquirer from "inquirer"
import * as fcl from "@onflow/fcl"
import { exec } from "child_process"
import {logger} from "../../utils/logger"
import {tags} from "../../utils/bcp47-tags"
import {readFiles, File} from "../../utils/file/read-files"
import {writeFile} from "../../utils/file/write-file"
import {question as selectCDCFiles} from "../../questions/generate/select-cdc-files"
import {question as selectInteractionType} from "../../questions/generate/interaction-type"
import {question as inputInterfaceID} from "../../questions/generate/interface-id"
import {question as inputMessages} from "../../questions/generate/messages"
import {question as inputAuthor} from "../../questions/generate/author"
import {question as inputArguments} from "../../questions/generate/arguments"
import {question as inputVersion} from "../../questions/generate/version"
import {generateTemplate} from '../../utils/template/generate-template'
import {generateTemplateMonad, iTemplateMonad} from "../../utils/template/template-monad"
import {generateSplashTitle} from "../../utils/splashscreen"
import {generatePins} from "../../questions/generate/generate-pins"

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

    generateSplashTitle()

    let files: File[] = await readFiles(path)

    const flowJSONFiles = await readFiles("flow.json")
    const flowJSON = flowJSONFiles[0] ? JSON.parse(flowJSONFiles[0].content) : null

    // If more than one file found, ask which files they want to generate templates for.
    files = await selectCDCFiles(files)

    for (let i = 0; i < files.length; i++) {
      let file = files[i]

      logger.default(`\n🌱 [Template ${i + 1} / ${files.length}] ⚙️  Generating template for ${file.path}\n\n----${file.path}----`)
      logger.default(file.content)
      logger.default(`----\n`)

      let templateMonad = generateTemplateMonad(file, flowJSON)

      let questions = [
        // generatePins,
        selectInteractionType,
        inputMessages,
        inputArguments,
        generatePins,
        inputInterfaceID
      ]

      templateMonad = 
        await questions.reduce(
          async (tm, question) => question(await tm), 
          Promise.resolve(templateMonad)
        )

      // let detectedScript = file.content.match(/pub fun main/g)
      // let detectedTransaction = !detectedScript && file.content.match(/transaction/g)

      let template = await generateTemplate(templateMonad)

      logger.default("\n🌱 Template: \n\n", JSON.stringify(template, null, 2), "\n")

      const filePathLessCDC = 
        file.path.split(".")
        .slice(0, file.path.split(".").length - 1)
        .map(s => s === "" ? "." : s)
        .join("")
      let filePathParts = [filePathLessCDC]
      filePathParts.push("template")
      filePathParts.push("json")
      let templateFilePath = filePathParts.join(".")

      await writeFile(templateFilePath, JSON.stringify(template, null, 2))

      logger.default(`\n🌱 Saved interaction template to ${templateFilePath}\n`)
    }

    logger.default("\n🌱🎉 Interaction template generation complete!\n")
  }
}
