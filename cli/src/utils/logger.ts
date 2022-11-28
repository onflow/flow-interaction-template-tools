import chalk from "chalk"

export const logger = {
  default: (...args: any[]) => console.log(chalk.bold(...args)),
  error: (...args: any[]) => console.log(chalk.red.bold(...args)),
  warn: (...args: any[]) => console.log(chalk.yellow.bold(...args)),
}
