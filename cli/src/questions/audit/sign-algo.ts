import inquirer from "inquirer"
import {File} from "../../utils/file/read-files"
import {iAuditMonad} from "../../utils/audit/audit-monad"
import {logger} from "../../utils/logger"

export async function question(templateMonad: iAuditMonad): Promise<iAuditMonad> {
    if (templateMonad.sigAlg !== undefined) return templateMonad

    let sigAlg = ""
    await inquirer.prompt([
        {
        type: 'list',
        message: 'Select the signature algorithm.',
        name: 'sigAlg',
        choices: [
            {
                name: "ECDSA_P256",
                value: "ECDSA_P256",
            },
            {
                name: "ECDSA_secp256k1",
                value: "ECDSA_secp256k1",
            }
        ]
        ,
        validate(answer) {
            if (!answer) {
                return 'You must choose a signature algorithm.';
            }
    
            return true;
        },
        }
    ]).then(answers => {
        sigAlg = answers.sigAlg
    })

    return {
        ...templateMonad,
        sigAlg
    }
}