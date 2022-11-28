import inquirer from "inquirer"
import {File} from "../../utils/file/read-files"

export async function question(files: File[]) {
  if (files.length > 1) {
    await inquirer.prompt([
      {
        type: "checkbox",
        message: "Select .template.cdc files to generate templates for.",
        name: "files",
        choices:
                files.map(file => ({
                  name: file.path,
                  value: file,
                })),
        validate(answer) {
          if (answer.length === 0) {
            return "You must choose at least one .template.cdc file."
          }

          return true
        },
      },
    ]).then(answers => {
      return answers.files
    })
  }

  return files
}
