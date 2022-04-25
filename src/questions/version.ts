import inquirer from "inquirer"
import {File} from "../utils/read-files"

export async function question(file: File): Promise<string> {
    return inquirer.prompt([
        {
          type: 'version',
          message: `[${file?.path}] Input the template version (eg: 1.0.1):`,
          name: 'version',
          validate(answer) {    
            return true;
          },
        }
      ]).then(answers => {
        return answers.version
      })
}