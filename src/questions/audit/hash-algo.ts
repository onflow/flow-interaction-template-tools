import inquirer from "inquirer"
import {iAuditMonad} from "../../utils/audit/audit-monad"
import {logger} from "../../utils/logger"

export async function question(templateMonad: iAuditMonad): Promise<iAuditMonad> {
    if (templateMonad.hashAlg !== undefined) return templateMonad

    let hashAlg = ""
    await inquirer.prompt([
        {
        type: 'list',
        message: 'Select the hash algorithm.',
        name: 'hashAlg',
        choices: [
            {
                name: "SHA2_256",
                value: "SHA2_256",
            },
            {
                name: "SHA3_256",
                value: "SHA3_256",
            }
        ]
        ,
        validate(answer) {
            if (!answer) {
                return 'You must choose a hash algorithm.';
            }
    
            return true;
        },
        }
    ]).then(answers => {
        hashAlg = answers.hashAlg
    })

    return {
        ...templateMonad,
        hashAlg
    }
}