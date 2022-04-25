import inquirer from "inquirer"
import {File} from "../utils/read-files"

export async function question(file: File): Promise<string> {
    return inquirer.prompt([
        {
          type: 'input',
          message: `[${file?.path}] Input the id of the InteractionInterface this template will conform to [OPTIONAL]:`,
          name: 'iface',
          validate(answer) {    
            return true;
          },
        }
      ]).then(answers => {
        return answers.iface
      })
}