import chalk from 'chalk'

export const logger = {
    default: (...args: any[]) => console.log(chalk.whiteBright.bold(...args))
}