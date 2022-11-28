import inquirer from "inquirer"
import {File} from "../../utils/file/read-files"
import {tags} from "../../utils/bcp47-tags"
import {iTemplateMonad} from "../../utils/template/template-monad"
import {logger} from "../../utils/logger"

export async function question(templateMonad: iTemplateMonad): Promise<iTemplateMonad> {
  logger.default("\n🌱 Collecting template messages")
  logger.default("🌱 A title and description are recommended\n")

  const file: File = templateMonad.file

  const messages = <any>{}
  let continueGatheringMessages = true
  while (continueGatheringMessages) {
    let currMessageKey = ""
    await inquirer.prompt([
      {
        type: "input",
        message: `[${file?.path}] Key for the message (Hint: "title", "description"):`,
        name: "msgKey",
        validate(answer) {
          const ans = String(answer)
          if (answer.length === 0) return "Key must be at least one character."
          if (messages[answer]) return "Cannot use the same key twice."
          return true
        },
      },
    ]).then(answers => {
      currMessageKey = answers.msgKey
    })

    const messageTranslations = <any>{}
    let continueGatheringMessageTranslations = true
    while (continueGatheringMessageTranslations) {
      let currMessageLangTag = ""
      await inquirer.prompt([
        {
          type: "list",
          message: `[${file?.path}] Language translation for ${currMessageKey}:`,
          name: "msgLangTag",
          choices: tags.map(tag => ({
            name: tag,
            value: tag,
          })),
          validate(answer) {
            if (messages[answer]) return `Cannot use the same language translation twice for ${currMessageKey}.`
            return true
          },
        },
      ]).then(answers => {
        currMessageLangTag = answers.msgLangTag
      })

      let currMessageLangTagTranslation = ""
      await inquirer.prompt([
        {
          type: "input",
          message: `[${file?.path}] Message content for ${currMessageLangTag} translation for ${currMessageKey}:`,
          name: "msgLangTagTranslation",
          validate(answer) {
            if (answer.length === 0) return "Translation must be at least one character."
            return true
          },
        },
      ]).then(answers => {
        currMessageLangTagTranslation = answers.msgLangTagTranslation
      })

      messageTranslations[currMessageLangTag] = currMessageLangTagTranslation

      await inquirer.prompt([
        {
          type: "confirm",
          message: `[${file?.path}] Continue submitting message translations for ${currMessageKey}?:`,
          name: "continueMessageTranslations",
          validate(answer) {
            return true
          },
        },
      ]).then(answers => {
        continueGatheringMessageTranslations = answers.continueMessageTranslations
      })
    }

    messages[currMessageKey] = {
      i18n: messageTranslations,
    }

    await inquirer.prompt([
      {
        type: "confirm",
        message: `[${file?.path}] Continue submitting messages?:`,
        name: "continueMessages",
        validate(answer) {
          return true
        },
      },
    ]).then(answers => {
      continueGatheringMessages = answers.continueMessages
    })
  }

  return ({
    ...templateMonad,
    messages,
  })
}
