import {Command, Flags} from "@oclif/core"
import inquirer from "inquirer"
import * as fcl from "@onflow/fcl"
import {exec} from "node:child_process"
import {logger} from "../../utils/logger"
import {tags} from "../../utils/bcp47-tags"
import {readFiles, File} from "../../utils/file/read-files"
import {writeFile} from "../../utils/file/write-file"
import {question as selectTemplateFiles} from "../../questions/audit/select-template-files"
import {question as inputAccount} from "../../questions/audit/input-account"
import {question as inputKeyId} from "../../questions/audit/key-id"
import {question as inputSigAlgo} from "../../questions/audit/sign-algo"
import {question as inputHashAlgo} from "../../questions/audit/hash-algo"
import {question as inputPrivateKey} from "../../questions/audit/input-private-key"
import {question as inputNetwork} from "../../questions/audit/input-network"
import {generateAuditMonad, iAuditMonad} from "../../utils/audit/audit-monad"
import {auditSplashTitle} from "../../utils/splashscreen"
import {sign} from "../../utils/crypto/sign"
import {signSendAuditTransaction} from "../../utils/audit/sign-send-audit-transaction"

export default class Generate extends Command {
  static description = "Audit Interaction Template json files.";

  static examples = ["$ flowplate audit ./src/cadence"];

  static flags = {
    flowJsonPath: Flags.string({
      char: "f",
      summary: "Path to a flow.json configuration file.",
    }),
  };

  static args = [
    {
      name: "path",
      description:
        "Path to a folder or individual Interaction Template JSON file.",
      required: true,
    },
  ];

  async run(): Promise<void> {
    const {argv, args, flags} = await this.parse(Generate)
    const {path} = args

    const a = "a"

    auditSplashTitle()

    logger.warn(
      "⚠️  Warning: The FLIX CLI is currently in early alpha. Please report any bugs by opening an issue here: https://github.com/onflow/flow-interaction-template-tools/issues/new",
    )

    let files: File[] = await readFiles(path)

    const flowJSONFiles = await readFiles(flags.flowJsonPath || "flow.json")
    const flowJSON = flowJSONFiles[0] ?
      JSON.parse(flowJSONFiles[0].content) :
      null

    if (flowJSON === null) {
      logger.error("❌ Error: No flow.json file found.")
      return
    }

    // If more than one file found, ask which files they want to generate templates for.
    files = await selectTemplateFiles(files)

    for (let i = 0; i < files.length; i++) {
      const file = files[i]

      const template = JSON.parse(file.content)

      logger.default(
        `\n🌱 [Audit ${i + 1} / ${files.length}] ⚖️  Generating audit for ${
          file.path
        }\n\n----${file.path}----`,
      )
      logger.default(file.content)
      logger.default("----\n")

      let auditMonad = generateAuditMonad(file, flowJSON)

      const inputs = [
        inputAccount,
        inputNetwork,
        inputPrivateKey,
        inputKeyId,
        inputSigAlgo,
        inputHashAlgo,
      ]

      // DO BETTER
      if (auditMonad.signerNetwork === "mainnet") {
        await fcl
        .config()
        .put("0xFlowInteractionTemplateAudit", "0xfd100e39d50a13e6")
      } else if (auditMonad.signerNetwork === "testnet") {
        await fcl
        .config()
        .put("0xFlowInteractionTemplateAudit", "0xf78bfc12d0a786dc")
      }

      auditMonad = await inputs.reduce(
        async (am, input) => input(await am),
        Promise.resolve(auditMonad),
      )

      auditMonad = {
        ...auditMonad,
        signerAddress: fcl.withPrefix(auditMonad.account?.address),
        signerKeyId: auditMonad.keyId,
      }

      const auditTxId = await signSendAuditTransaction(auditMonad)

      logger.default(
        "\n🌱 Audit TxID: \n\n",
        JSON.stringify(auditTxId, null, 2),
        "\n",
      )

      logger.default("\n🌱 Audit transaction Submitted, awaiting Execution")

      await new Promise((res, rej): void => {
        fcl
        .config()
        .overload({"accessNode.api": auditMonad.accessNodeAPI!}, async () =>
          fcl.tx(auditTxId!).subscribe(tx => {
            if (tx.status === 3) {
              logger.default(
                "\n🌱 Audit transaction Executed, awaiting Sealing",
              )
            }

            if (tx.status >= 4) {
              logger.default("\n🌱 Audit transaction Sealed")
              res(null)
            }
          }),
        )
      })
    }

    logger.default("\n🌱🎉 Interaction audit complete!\n")
  }
}
