import inquirer from "inquirer"
import {File} from "../../utils/file/read-files"
import {iAuditMonad} from "../../utils/audit/audit-monad"
import {logger} from "../../utils/logger"

export async function question(templateMonad: iAuditMonad): Promise<iAuditMonad> {
  if (templateMonad.account !== undefined) return templateMonad

  logger.default("\n🌱 Collecting account to perform audit\n")

  const flowJSONAccounts = templateMonad.flowJSON?.accounts
  const flowJSONAccountsKeys = Object.keys(flowJSONAccounts)

  let selectedAccount = ""
  await inquirer.prompt([
    {
      type: "list",
      message: "Select the account to generate the audit.",
      name: "account",
      choices:
            flowJSONAccountsKeys.map(accountName => ({
              name: accountName,
              value: accountName,
            })),
      validate(answer) {
        if (!answer) {
          return "You must choose one account."
        }

        return true
      },
    },
  ]).then(answers => {
    selectedAccount = answers.account
  })

  return {
    ...templateMonad,
    account: flowJSONAccounts[selectedAccount],
  }
}
