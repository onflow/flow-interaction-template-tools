import {Command, Flags} from '@oclif/core'
import inquirer from "inquirer"
import * as fcl from "@onflow/fcl"
import { exec } from "child_process"
import {logger} from "../../utils/logger"
import {tags} from "../../utils/bcp47-tags"
import {readFiles, File} from "../../utils/file/read-files"
import {writeFile} from "../../utils/file/write-file"
import {question as selectTemplateFiles} from "../../questions/audit/select-template-files"
import {generateAudit} from '../../utils/audit/generate-audit'
import {question as inputAccount} from "../../questions/audit/input-account"
import {question as inputKeyId} from "../../questions/audit/key-id"
import {question as inputSigAlgo} from "../../questions/audit/sign-algo"
import {question as inputHashAlgo} from "../../questions/audit/hash-algo"
import {question as inputPrivateKey} from "../../questions/audit/input-private-key"
import {generateAuditMonad, iAuditMonad} from "../../utils/audit/audit-monad"
import {auditSplashTitle} from "../../utils/splashscreen"
import {sign} from "../../utils/crypto/sign"

const rightPaddedHexBuffer = (value: string, pad: number) =>
  Buffer.from(value.padEnd(pad * 2, "0"), "hex")

export default class Generate extends Command {
  static description = 'Generate transaction templates from .cdc files.'

  static examples = [
    `$ flowplate audit ./src/cadence`,
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

    auditSplashTitle()

    let files: File[] = await readFiles(path)

    const flowJSONFiles = await readFiles("flow.json")
    const flowJSON = flowJSONFiles[0] ? JSON.parse(flowJSONFiles[0].content) : null

    // If more than one file found, ask which files they want to generate templates for.
    files = await selectTemplateFiles(files)

    for (let i = 0; i < files.length; i++) {
      let file = files[i]

      let template = JSON.parse(file.content)

      logger.default(`\n🌱 [Audit ${i + 1} / ${files.length}] ⚖️  Generating audit for ${file.path}\n\n----${file.path}----`)
      logger.default(file.content)
      logger.default(`----\n`)

      let auditMonad = generateAuditMonad(file, flowJSON)
      
      let inputs = [
        inputAccount,
        inputPrivateKey,
        inputKeyId,
        inputSigAlgo,
        inputHashAlgo,
      ]

      auditMonad = 
        await inputs.reduce(
          async (am, input) => input(await am), 
          Promise.resolve(auditMonad)
        )

      const USER_DOMAIN_TAG = 
        rightPaddedHexBuffer(
          Buffer.from("FLOW-V0.0-user").toString("hex"),
          32
        ).toString("hex")

      let msg = USER_DOMAIN_TAG + template?.id

      const sig = await sign(auditMonad.privateKey!, auditMonad.sigAlg!, auditMonad.hashAlg!, msg)

      auditMonad = {
        ...auditMonad,
        signerAddress: fcl.withPrefix(auditMonad.account?.address),
        signerKeyId: auditMonad.keyId,
        signerSignature: sig
      }

      let audit = generateAudit(auditMonad)

      logger.default("\n🌱 Audit: \n\n", JSON.stringify(audit, null, 2), "\n")

      let filePathLessCDC = 
        file.path.split(".")
        .slice(0, file.path.split(".").length - 1)
        .filter(s => s !== "")
        .join(".")
      if (file.path.split("")[0] === ".") filePathLessCDC = "." + filePathLessCDC

      let filePathParts = [filePathLessCDC]
      filePathParts.push("audit")
      filePathParts.push("json")
      let auditFilePath = filePathParts.join(".")

      await writeFile(auditFilePath, JSON.stringify(audit, null, 2))

      logger.default(`\n🌱 Saved interaction audit to ${auditFilePath}\n`)
    }

    logger.default("\n🌱🎉 Interaction audit complete!\n")
  }
}
