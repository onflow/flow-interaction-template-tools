import inquirer from "inquirer"
import {File} from "../utils/read-files"

export async function question(file: File): Promise<string> {
    let detectedScript = file.content.match(/pub fun main/g)
    let detectedTransaction = !detectedScript && file.content.match(/transaction/g)

    let type: string = ""
    return inquirer.prompt([
        {
            type: 'list',
            message: `[${file?.path}] Select the type of interaction:`,
            name: 'type',
            default: detectedTransaction ? "transaction" : "script",
            choices: [
                {
                    name: `transaction ${detectedTransaction ? "(detected)" : ""}`,
                    value: "transaction",
                },
                {
                    name: `script ${detectedScript ? "(detected)" : ""}`,
                    value: "script",
                }
            ],
            validate(answer) {
            if (answer.length < 1) {
                return "You must choose an interaction type"
            }

            return true;
            },
        }
    ]).then(answers => {
        type = answers.type
        return type
    })
}