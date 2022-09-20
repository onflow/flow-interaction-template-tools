import { Command, Flags } from "@oclif/core";
import inquirer from "inquirer";
import * as fcl from "@onflow/fcl";
import { exec } from "child_process";
import { logger } from "../../utils/logger";
import { tags } from "../../utils/bcp47-tags";
import { readFiles, File } from "../../utils/file/read-files";
import { writeFile } from "../../utils/file/write-file";
import { question as selectTemplateFiles } from "../../questions/audit/select-template-files";
import { question as inputAccount } from "../../questions/audit/input-account";
import { question as inputKeyId } from "../../questions/audit/key-id";
import { question as inputSigAlgo } from "../../questions/audit/sign-algo";
import { question as inputHashAlgo } from "../../questions/audit/hash-algo";
import { question as inputPrivateKey } from "../../questions/audit/input-private-key";
import { question as inputNetwork } from "../../questions/audit/input-network";
import { generateAuditMonad, iAuditMonad } from "../../utils/audit/audit-monad";
import { auditSplashTitle } from "../../utils/splashscreen";
import { sign } from "../../utils/crypto/sign";
import { signSendAuditTransaction } from "../../utils/audit/sign-send-audit-transaction";

const rightPaddedHexBuffer = (value: string, pad: number) =>
  Buffer.from(value.padEnd(pad * 2, "0"), "hex");

export default class Generate extends Command {
  static description = "Generate transaction templates from .cdc files.";

  static examples = [`$ flowplate audit ./src/cadence`];

  static flags = {};

  static args = [
    {
      name: "path",
      description: "Path to a folder or individual CDC file.",
      required: true,
    },
  ];

  async run(): Promise<void> {
    const { argv, args, flags } = await this.parse(Generate);
    const { path } = args;

    auditSplashTitle();

    let files: File[] = await readFiles(path);

    const flowJSONFiles = await readFiles("flow.json");
    const flowJSON = flowJSONFiles[0]
      ? JSON.parse(flowJSONFiles[0].content)
      : null;

    // If more than one file found, ask which files they want to generate templates for.
    files = await selectTemplateFiles(files);

    for (let i = 0; i < files.length; i++) {
      let file = files[i];

      let template = JSON.parse(file.content);

      logger.default(
        `\n🌱 [Audit ${i + 1} / ${files.length}] ⚖️  Generating audit for ${
          file.path
        }\n\n----${file.path}----`
      );
      logger.default(file.content);
      logger.default(`----\n`);

      let auditMonad = generateAuditMonad(file, flowJSON);

      let inputs = [
        inputAccount,
        inputNetwork,
        inputPrivateKey,
        inputKeyId,
        inputSigAlgo,
        inputHashAlgo,
      ];

      // DO BETTER
      if (auditMonad.signerNetwork === "mainnet") {
        await fcl
          .config()
          .put("0xFlowInteractionTemplateAudit", "0xfd100e39d50a13e6");
      } else if (auditMonad.signerNetwork === "testnet") {
        await fcl
          .config()
          .put("0xFlowInteractionTemplateAudit", "0xf78bfc12d0a786dc");
      }

      auditMonad = await inputs.reduce(
        async (am, input) => input(await am),
        Promise.resolve(auditMonad)
      );

      auditMonad = {
        ...auditMonad,
        signerAddress: fcl.withPrefix(auditMonad.account?.address),
        signerKeyId: auditMonad.keyId,
      };

      let auditTxId = await signSendAuditTransaction(auditMonad);

      logger.default(
        "\n🌱 Audit TxID: \n\n",
        JSON.stringify(auditTxId, null, 2),
        "\n"
      );

      logger.default("\n🌱 Audit transaction Submitted, awaiting Execution");

      await new Promise((res, rej): void => {
        fcl
          .config()
          .overload({ "accessNode.api": auditMonad.accessNodeAPI! }, async () =>
            fcl.tx(auditTxId!).subscribe((tx) => {
              if (tx.status === 3) {
                logger.default(
                  "\n🌱 Audit transaction Executed, awaiting Sealing"
                );
              }

              if (tx.status >= 4) {
                logger.default("\n🌱 Audit transaction Sealed");
                res(null);
              }
            })
          );
      });
    }

    logger.default("\n🌱🎉 Interaction audit complete!\n");
  }
}
