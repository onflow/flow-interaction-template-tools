import {Command, Flags} from '@oclif/core'

export default class Test extends Command {
  static description = 'Epic test command'

  static examples = [
    `$ oex hello friend --from oclif
hello friend from oclif! (./src/commands/hello/index.ts)
`,
  ]

  static flags = {
    from: Flags.string({char: 'f', description: 'Whom is saying hello', required: false}),
  }

  static args = [{name: 'person', description: 'Person to say hello to', required: false}]

  async run(): Promise<void> {
    const {args, flags} = await this.parse(Test)

    this.log(`testy test! (./src/commands/hello/index.ts)`)
  }
}
