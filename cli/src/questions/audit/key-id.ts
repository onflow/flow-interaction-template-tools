import inquirer from "inquirer";
import { File } from "../../utils/file/read-files";
import { iAuditMonad } from "../../utils/audit/audit-monad";
import { logger } from "../../utils/logger";

export async function question(
  templateMonad: iAuditMonad
): Promise<iAuditMonad> {
  if (templateMonad.keyId !== undefined) return templateMonad;

  let account = templateMonad.account?.address;

  let selectedKeyId = 0;
  await inquirer
    .prompt([
      {
        type: "input",
        message: `Input the key id for key on account ${account}:`,
        name: "keyId",
        validate(answer) {
          if (
            typeof answer === undefined ||
            !Number.isInteger(Number(answer))
          ) {
            return "You must choose a key id.";
          }

          return true;
        },
      },
    ])
    .then((answers) => {
      selectedKeyId = Number(answers.keyId);
    });

  return {
    ...templateMonad,
    keyId: selectedKeyId,
  };
}
