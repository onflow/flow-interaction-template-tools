import {Command, Flags} from "@oclif/core"
import * as fcl from "@onflow/fcl"
import {logger} from "../../utils/logger"
import {readFiles, File} from "../../utils/file/read-files"
import {question as selectNetwork} from "../../questions/verify/network"
import {verifySplashTitle} from "../../utils/splashscreen"

export default class Generate extends Command {
  static description =
    "Verify that an Interaction Template has been audited by an Auditor.";

  static examples = [
    "$ flowplate verify \"./src/cadence/template.json\" \"0xABC123DEF456 ",
  ];

  static flags = {
    flowJsonPath: Flags.string({
      char: "f",
      summary: "Path to a flow.json configuration file.",
    }),
  };

  static args = [
    {
      name: "templatePath",
      description: "Path to an individual Interaction Template JSON file.",
      required: true,
    },
    {
      name: "auditorAddress",
      description:
        "Address of an Auditor to verify if they have audited the Interaction Template.",
      required: true,
    },
  ];

  async run(): Promise<void> {
    const {argv, args, flags} = await this.parse(Generate)
    const {templatePath, auditorAddress} = args

    verifySplashTitle()

    logger.warn(
      "⚠️  Warning: The FLIX CLI is currently in early alpha. Please report any bugs by opening an issue here: https://github.com/onflow/flow-interaction-template-tools/issues/new",
    )

    const templateFiles: File[] = await readFiles(templatePath)

    if (templateFiles.length > 1) return // Cannot audit more than one template at a time

    const flowJSONFiles = await readFiles(flags.flowJsonPath || "flow.json")
    const flowJSON = flowJSONFiles[0] ?
      JSON.parse(flowJSONFiles[0].content) :
      null

    const templateFile = templateFiles[0]

    const template = JSON.parse(templateFile.content)

    logger.default(
      `\n🌱 Verifying audit by auditor ${auditorAddress} for ${templateFile.path}\n\n----${templateFile.path}----`,
    )
    logger.default(templateFile.content)
    logger.default("----\n\n")

    logger.default("\n🌱 Collecting network to perform audit\n")
    const network = await selectNetwork(flowJSON)

    const accessNodeAPI = flowJSON?.networks?.[network]
    await fcl.config().put("accessNode.api", accessNodeAPI)

    let isVerified = false
    try {
      const audits =
        await fcl.InteractionTemplateUtils.getInteractionTemplateAudits({
          template,
          auditors: [fcl.withPrefix(auditorAddress)],
        })
      isVerified = Object.keys(audits).includes(fcl.withPrefix(auditorAddress))
    } catch {
      logger.default("\n⚠️  Verify \n\nERROR")
      logger.default(
        `\n💡 Ensure Auditor address is valid for network=${network}\n`,
      )
      return
    }

    logger.default("\n🌱 Verify \n\n", isVerified ? "SUCCESS" : "FAIL", "\n")

    logger.default("\n🌱🎉 Audit verification complete!\n")
  }
}
