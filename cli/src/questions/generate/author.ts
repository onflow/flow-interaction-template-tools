import inquirer from "inquirer"
import * as fcl from "@onflow/fcl"
import {exec} from "child_process"
import {File} from "../../utils/file/read-files"
import {iTemplateMonad} from "../../utils/template/template-monad"

let lastUsedAuthorAddr: string;

export async function question(file: File, flowJSON: any) { 
    let authorAddr;
    await inquirer.prompt([
        {
            type: 'input',
            message: `[${file?.path}] Input the Flow address of the author of this template:`,
            name: 'authorAddr',
            default: lastUsedAuthorAddr || null,
            validate(answer) {    
            if (answer.length !== 16) {
                return "Account address must be 16 characters long"
            }

            return true;
            },
        }
    ]).then(answers => {
        authorAddr = answers.authorAddr
        lastUsedAuthorAddr = authorAddr
    })

    let flowJSONAuthorAccounts = []
    if (authorAddr && flowJSON?.accounts) {
        for (let acct in flowJSON?.accounts) {
            if (
                flowJSON?.accounts[acct]?.address 
                && fcl.withPrefix(flowJSON?.accounts[acct]?.address) === fcl.withPrefix(authorAddr)
            ) {
                flowJSONAuthorAccounts.push(acct)
            }
        }
    } 
    console.log("flowJSONAuthorAccounts", flowJSONAuthorAccounts)
    // Ask if user wants to include sig from acct using flow CLI
    if (flowJSONAuthorAccounts.length > 0) {
        console.log("The flow.json file includes accounts corresponding to the author of this interaction.")
        let doesUserWantToSign
        await inquirer.prompt([
            {
                type: 'confirm',
                message: `[${file?.path}] Do you want to sign with an account in the flow.json corresponding to the author of this interaction?:`,
                name: 'toSign',
                default: true,
                validate(answer) {    
                    return true;
                },
            }
        ]).then(answers => {
            doesUserWantToSign = answers.toSign
        })

        let flowJSONAccountToSign;
        await inquirer.prompt([
            {
                type: 'list',
                message: `[${file?.path}] Select the account in the flow.json to sign as the author of this interaction:`,
                name: 'flowJsonAccountToSign',
                choices: 
                    flowJSONAuthorAccounts.map(flowJSONAuthorAccount => ({
                    name: flowJSONAuthorAccount,
                    value: flowJSONAuthorAccount
                    }))
                ,
                validate(answer) {
                    if (answer.length < 1) {
                    return "You must choose an author account"
                    }
                    return true;
                },
            }
        ]).then(answers => {
            flowJSONAccountToSign = answers.flowJsonAccountToSign
        })

        const output = await (new Promise((res, rej) => {
            exec(``, (error, stdout, stderr) => {
                if (error) {
                    console.log(`error: ${error.message}`)
                    rej(error)
                    return
                }
                if (stderr) {
                    console.log(`stderr: ${stderr}`)
                    rej(stderr)
                    return
                }
                console.log(`stdout: ${stdout}`)
                res(stdout)
            })
        }))
    }
}