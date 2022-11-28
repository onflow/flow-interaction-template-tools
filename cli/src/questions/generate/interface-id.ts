import inquirer from "inquirer"
import {File} from "../../utils/file/read-files"
import {iTemplateMonad} from "../../utils/template/template-monad"
import {logger} from "../../utils/logger"

export async function question(
  templateMonad: iTemplateMonad,
): Promise<iTemplateMonad> {
  logger.default("\n🌱 Collecting interface id [optional]\n")

  const file: File = templateMonad.file

  let iface = ""
  await inquirer
  .prompt([
    {
      type: "input",
      message: `[${file?.path}] Input the id of the Interaction Template Interface that this Interaction Template will conform to [optional]:`,
      name: "iface",
      validate(answer) {
        return true
      },
    },
  ])
  .then(answers => {
    iface = answers.iface
  })

  return {
    ...templateMonad,
    iface,
  }
}
