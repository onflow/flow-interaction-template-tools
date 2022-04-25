import inquirer from "inquirer"
import {File} from "../utils/read-files"
import {tags} from "../utils/bcp47-tags"

export async function question(file: File) {
    let messages = <any>{}
    let continueGatheringMessages = true
    while (continueGatheringMessages) {
        let currMessageKey: string = ""
        await inquirer.prompt([
            {
            type: 'input',
            message: `[${file?.path}] Key for the message (Hint: "title", "description"):`,
            name: 'msgKey',
            validate(answer) { 
                let ans = String(answer) 
                if (answer.length === 0) return "Key must be at least one character."
                if (messages[answer]) return "Cannot use the same key twice."  
                return true;
            },
            }
        ]).then(answers => {
            currMessageKey = answers.msgKey
        })

        let messageTranslations = <any>{}
        let continueGatheringMessageTranslations = true
        while (continueGatheringMessageTranslations) {

            let currMessageLangTag: string = ""
            await inquirer.prompt([
                {
                    type: 'list',
                    message: `[${file?.path}] Language translation for ${currMessageKey}:`,
                    name: 'msgLangTag',
                    choices: tags.map(tag => ({
                    name: tag,
                    value: tag
                    })),
                    validate(answer) {
                    if (messages[answer]) return `Cannot use the same language translation twice for ${currMessageKey}.`  
                    return true;
                    },
                }
            ]).then(answers => {
                currMessageLangTag = answers.msgLangTag
            })
            
            let currMessageLangTagTranslation: string = ""
            await inquirer.prompt([
                {
                    type: 'input',
                    message: `[${file?.path}] Message content for ${currMessageLangTag} translation for ${currMessageKey}:`,
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
                    message: `[${file?.path}] Continue submitting message translations for ${currMessageKey}?:`,
                    name: 'continueMessageTranslations',
                    validate(answer) {    
                    return true;
                    },
                }
            ]).then(answers => {
                continueGatheringMessageTranslations = answers.continueMessageTranslations
            })
        }

        messages[currMessageKey] = messageTranslations

        await inquirer.prompt([
            {
            type: 'confirm',
            message: `[${file?.path}] Continue submitting messages?:`,
            name: 'continueMessages',
            validate(answer) {    
                return true;
            },
            }
        ]).then(answers => {
            continueGatheringMessages = answers.continueMessages
        })
    }

    return messages
}