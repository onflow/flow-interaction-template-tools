import inquirer from "inquirer"
// import * as fcl from "@onflow/fcl"
// import {exec} from "child_process"
import {tags} from "../utils/bcp47-tags"
import {File} from "../utils/read-files"

interface Arg {
    name: string,
    type: string
}

export function parseArgs(file: File): Arg[] | null {
    let argsList_RegEx = /(pub fun main| transaction)\(((\w+: \w+)(, )?)+\)/g
    let parsedArgsRegExResult = argsList_RegEx.exec(file?.content)
    let parsedArgsList = parsedArgsRegExResult ? parsedArgsRegExResult[0] : null
    let parsedArgsFromCDC = parsedArgsList ? parsedArgsList.match(/(\w+: \w+)/g) : null

    if (!parsedArgsFromCDC) return null

    let parsedArgs: (Arg | null)[] = 
        parsedArgsFromCDC.map(function (parsedArgFromCDC): Arg | null {
            let nameAndType = parsedArgFromCDC.match(/\w+/g)
            if (!nameAndType) return null
            return ({
                name: nameAndType[0],
                type: nameAndType[1]
            })
        })

    return parsedArgs.filter(a => a !== null) as Arg[]
}

export async function question(file: File): Promise<{ [key: string]: any }> {
    let messages = <any>{}

    let parsedArgs: Arg[] | null = parseArgs(file)

    if (!parsedArgs) return messages

    for (const arg of parsedArgs) {
        let messageTranslations = <any>{}

        let continueGatheringMessageTranslations = true
        while (continueGatheringMessageTranslations) {
            let currMessageLangTag: string = ""
            await inquirer.prompt([
                {
                    type: 'list',
                    message: `[${file?.path}] Language translation for argument ${arg?.name}:`,
                    name: 'msgLangTag',
                    choices: tags.map(tag => ({
                        name: tag,
                        value: tag
                    })),
                    validate(answer) {
                        if (messages[answer]) return `Cannot use the same language translation twice for ${arg?.name}.`  
                        return true
                    },
                }
            ]).then(answers => {
                currMessageLangTag = answers.msgLangTag
            })
            
            let currMessageLangTagTranslation: string = ""
            await inquirer.prompt([
                {
                    type: 'input',
                    message: `[${file?.path}] Message content for ${currMessageLangTag} translation for argument ${arg?.name}:`,
                    name: 'msgLangTagTranslation',
                    validate(answer) { 
                        if (answer.length === 0) return "Translation must be at least one character."
                        return true;
                    },
                }
            ]).then(answers => {
                currMessageLangTagTranslation = answers.msgLangTagTranslation
            })

            messageTranslations[currMessageLangTag] = currMessageLangTagTranslation

            await inquirer.prompt([
                {
                    type: 'confirm',
                    message: `[${file?.path}] Continue submitting message translations for ${arg?.name}?:`,
                    name: 'continueMessageTranslations',
                    validate(answer) {    
                        return true;
                    },
                }
            ]).then(answers => {
                continueGatheringMessageTranslations = answers.continueMessageTranslations
            })
        }

        messages[arg?.name] = messageTranslations
    }

    return messages
}