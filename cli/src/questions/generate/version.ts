import inquirer from "inquirer"
import {File} from "../../utils/file/read-files"
import {iTemplateMonad} from "../../utils/template/template-monad"
import {logger} from "../../utils/logger"

export async function question(templateMonad: iTemplateMonad): Promise<iTemplateMonad> {
  logger.default("\n🌱 Collecting interaction version\n")

  let file: File = templateMonad.file
 
  let version = ""
  await inquirer.prompt([
      {
        type: 'version',
        message: `[${file?.path}] Input the template version (eg: 1.0.1):`,
        name: 'version',
        validate(answer) {    
          return true;
        },
      }
    ]).then(answers => {
      version = answers.version
    })

  return {
    ...templateMonad,
    version
  }
}