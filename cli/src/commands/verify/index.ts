import {Command, Flags} from '@oclif/core'
import * as fcl from "@onflow/fcl"
import {logger} from "../../utils/logger"
import {readFiles, File} from "../../utils/file/read-files"  
import {question as selectNetwork} from "../../questions/verify/network"
import {verifySplashTitle} from "../../utils/splashscreen"

export default class Generate extends Command {
  static description = 'Verify InteractionTemplate using a corresponding InteractionTemplateAudit.'

  static examples = [
    `$ flowplate verify ./src/cadence/template ./src/cadence/audit`,
  ]

  static flags = {}

  static args = [{
    name: 'templatePath',
    description: 'Path to a file containing an InteractionTemplate.',
    required: true,
  },{
    name: 'auditPath',
    description: 'Path to a file containing an InteractionTemplateAudit.',
    required: true,
  }]

  async run(): Promise<void> {
    const {argv, args, flags} = await this.parse(Generate)
    const { templatePath, auditPath } = args

    verifySplashTitle()

    let templateFiles: File[] = await readFiles(templatePath)
    let auditFiles: File[] = await readFiles(auditPath)

    if (auditFiles.length > 1) return // Cannot audit more than one audit at a time

    const flowJSONFiles = await readFiles("flow.json")
    const flowJSON = flowJSONFiles[0] ? JSON.parse(flowJSONFiles[0].content) : null

    // // If more than one file found, ask which files they want to generate templates for.
    // files = await selectTemplateFiles(files)
    // // If more than one file found, ask which files they want to generate templates for.
    // files = await selectTemplateFiles(files)

    let auditFile = auditFiles[0]
    let templateFile = templateFiles[0]

    let template = JSON.parse(templateFile.content)
    let audit = JSON.parse(auditFile.content)

    logger.default(`\n🌱 Verifying audit ${auditFile.path} for ${templateFile.path}\n\n----${templateFile.path}----`)
    logger.default(templateFile.content)
    logger.default(`----\n\n`)
    logger.default(`----${auditFile.path}----`)
    logger.default(auditFile.content)
    logger.default(`----\n`)

    logger.default("\n🌱 Collecting network to perform audit\n")
    let network = await selectNetwork(flowJSON)

    const accessNodeAPI = flowJSON?.networks?.[network]

    await fcl.config().put("accessNode.api", accessNodeAPI)

    let account = await fcl.account(audit?.data?.signer?.address)
    let key = account?.keys[audit?.data?.signer?.key_id]

    let sigAlgo = key.signAlgoString
    let hashAlgo = key.hashAlgoString
    let pubKey = key.publicKey

    if (!sigAlgo) throw new Error("Unknown sig algo")
    if (!hashAlgo) throw new Error("Unknown hash algo")

    let msg = template?.id

    let address = audit?.data?.signer?.address
    let key_id = audit?.data?.signer?.key_id
    let signature = audit?.data?.signer?.signature

    let isVerified = false

    try {
      isVerified = await fcl.query({
        cadence: `
        pub fun main(
          address: Address,
          message: String,
          keyIndex: Int,
          signature: String,
          domainSeparationTag: String,
        ): Bool {
          let account = getAccount(address)

          let accountKey = account.keys.get(keyIndex: keyIndex) ?? panic("Key provided does not exist on account")
          
          let messageBytes = message.decodeHex()
          let sigBytes = signature.decodeHex()

          // Ensure the key is not revoked
          if accountKey.isRevoked {
              return false
          }

          // Ensure the signature is valid
          return accountKey.publicKey.verify(
              signature: sigBytes,
              signedData: messageBytes,
              domainSeparationTag: domainSeparationTag,
              hashAlgorithm: accountKey.hashAlgorithm
          )
        }
        `,
        args: (arg, t) => ([
          arg(address, t.Address),
          arg(msg, t.String),
          arg(String(key_id), t.Int),
          arg(signature, t.String),
          arg("FLOW-V0.0-user", t.String),
        ])
      })
    } catch(e) {}

    logger.default("\n🌱 Verify \n\n", isVerified ? "SUCCESS" : "FAIL", "\n")

    logger.default("\n🌱🎉 Interaction audit complete!\n")
  }
}
