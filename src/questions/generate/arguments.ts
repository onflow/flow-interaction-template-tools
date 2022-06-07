import inquirer from "inquirer"
// import * as fcl from "@onflow/fcl"
// import {exec} from "child_process"
import chalk from "chalk"
import {tags} from "../../utils/bcp47-tags"
import {File} from "../../utils/file/read-files"
import {iTemplateMonad} from "../../utils/template/template-monad"
import {logger} from "../../utils/logger"

interface Arg {
    name: string,
    type: string
}

export function parseArgs(file: File): Arg[] | null {
    let argsList_RegEx = /(pub fun main|transaction)\(((\w+: \w+)(, )?)+\)/g
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

export async function question(templateMonad: iTemplateMonad): Promise<iTemplateMonad> {
    logger.default("\n🌱 Collecting argument messages\n")

    let file: File = templateMonad.file

    let messages = <any>{}

    let parsedArgs: Arg[] | null = parseArgs(file)

    if (!parsedArgs) return messages

    let argIndex = 0
    for (const arg of parsedArgs) {
        let messageTranslations = <any>{}
        
        let continueGatheringMessages = true;

        while (continueGatheringMessages) {

            let currMessageKey: string = ""
            await inquirer.prompt([
                {
                    type: 'input',
                    message: `[${file?.path}] Key for the message (Hint: "title", "description") for argument ${chalk.whiteBright.bold.inverse(`- (${arg?.name}: ${arg?.type}) -`)}:`,
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

            let continueGatheringMessageTranslations = true

            while (continueGatheringMessageTranslations) {
                let currMessageLangTag: string = ""
                await inquirer.prompt([
                    {
                        type: 'list',
                        message: `[${file?.path}] Language translation for ${chalk.whiteBright.bold.inverse(`- ${currMessageKey} -`)} for argument ${chalk.whiteBright.bold.inverse(`- (${arg?.name}: ${arg?.type}) -`)}:`,
                        name: 'msgLangTag',
                        choices: tags.map(tag => ({
                            name: tag,
                            value: tag
                        })),
                        validate(answer) {
                            if (messages[answer]) return `Cannot use the same language translation twice for ${chalk.whiteBright.bold.inverse(`- ${currMessageKey} -`)} for argument ${chalk.whiteBright.bold.inverse(`- (${arg?.name}: ${arg?.type}) -`)}.`  
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
                        message: `[${file?.path}] Message content for ${chalk.whiteBright.bold.inverse(`- ${currMessageLangTag} -`)} translation for ${chalk.whiteBright.bold.inverse(`- ${currMessageKey} -`)} for argument ${chalk.whiteBright.bold.inverse(`- (${arg?.name}: ${arg?.type}) -`)}:`,
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
                        message: `[${file?.path}] Continue submitting message translations for ${chalk.whiteBright.bold.inverse(`- ${currMessageKey} -`)} for argument ${chalk.whiteBright.bold.inverse(`- (${arg?.name}: ${arg?.type}) -`)}?:`,
                        name: 'continueMessageTranslations',
                        validate(answer) {    
                            return true;
                        },
                    }
                ]).then(answers => {
                    continueGatheringMessageTranslations = answers.continueMessageTranslations
                })
            }

            messages[arg?.name] = {
                ...(messages[arg?.name] || {}),
                index: argIndex,
                messages: {
                    ...(messages[arg?.name]?.messages || {}),
                    [currMessageKey]: {
                        i18n: {
                            ...messageTranslations
                        }
                    }
                }
            }

            await inquirer.prompt([
                {
                type: 'confirm',
                message: `[${file?.path}] Continue submitting messages for ${chalk.whiteBright.bold.inverse(`- (${arg?.name}: ${arg?.type}) -`)}?:`,
                name: 'continueMessages',
                validate(answer) {    
                    return true;
                },
                }
            ]).then(answers => {
                continueGatheringMessages = answers.continueMessages
            })
    
            argIndex = argIndex + 1

        }
    }

    return {
        ...templateMonad,
        messages
    }
}