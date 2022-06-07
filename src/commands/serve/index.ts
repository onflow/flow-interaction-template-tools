import {Command, Flags} from '@oclif/core'
import inquirer from "inquirer"
import * as fcl from "@onflow/fcl"
import { exec } from "child_process"
import {logger} from "../../utils/logger"
import {readFiles, File} from "../../utils/file/read-files"
import {auditSplashTitle} from "../../utils/splashscreen"
import express from "express"

export default class Generate extends Command {
  static description = 'Serve templates and audits by id.'

  static examples = [
    `$ flowplate serve ./src/templates`,
  ]

  static flags = {}

  static args = [{
    name: 'path',
    description: 'Path to a folder or individual CDC file.',
    required: true,
  }, {
    name: 'port',
    description: 'Port to run on.',
    required: false,
  }]

  async run(): Promise<void> {
    const {argv, args, flags} = await this.parse(Generate)
    const { path, port } = args

    // auditSplashTitle()

    let files: File[] = await readFiles(path)
    let parsedFiles = files.map(file => {
        try {
            let json = JSON.parse(file.content)
            return json
        } catch (e) {
            return null
        }
    }).filter(file => file !== null)

    logger.default(`\n--- 🔎 Finding InteractionTemplate ---\n`)
    let templates = parsedFiles.filter(file => {
        if (file?.f_type === "InteractionTemplate") {
            logger.default(`\n🌱 Serving InteractionTemplate id = ${file?.id}\n`)
            return true
        } else {
            return false
        }
    })
    if (templates.length === 0) logger.default(`\n⚠️ No InteractionTemplate found\n`)

    logger.default(`\n--- 🔎 Finding InteractionTemplateAudit ---\n`)
    let audits = parsedFiles.filter(file => {
        if (file?.f_type === "InteractionTemplateAudit") {
            logger.default(`\n🌱 Serving InteractionTemplateAudit id = ${file?.id}\n`)
            return true
        } else {
            return false
        }
    })
    if (audits.length === 0) logger.default(`\n⚠️ No InteractionTemplateAudit found\n`)

    let app = express()

    app.get('/templates/:id', function (req: any, res: any) {
        let id = req.params.id
        let foundTemplate = templates.find(template => template.id === id)

        if (foundTemplate) {
            res.json(foundTemplate)
        } else {
            res.status(404).json({ error: 'Cannot find template with id = ' + id })
        }
    })

    app.get('/audits/:id', function (req: any, res: any) {
        let id = req.params.id
        let foundAudit = audits.find(audit => audit.id === id)

        if (foundAudit) {
            res.json(foundAudit)
        } else {
            res.status(404).json({ error: 'Cannot find audit with id = ' + id })
        }
    })

    app.listen(Number(port))

    logger.default(`\n🌱🚀 Flowplates server running on port ${port} !\n`)
    logger.default(`\n🌱 http://localhost:${port}/templates/:id => InteractionTemplate`)
    logger.default(`🌱 http://localhost:${port}/audits/:id => InteractionTemplateAudit\n`)
  }
}
