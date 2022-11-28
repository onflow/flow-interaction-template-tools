import {Command, Flags} from "@oclif/core"
import inquirer from "inquirer"
import * as fcl from "@onflow/fcl"
import {exec} from "node:child_process"
import {logger} from "../../utils/logger"
import {readFiles, File} from "../../utils/file/read-files"
import {auditSplashTitle} from "../../utils/splashscreen"
import express from "express"
import cors from "cors"

export default class Generate extends Command {
  static description = "Serve Interaction Templates queryable by id.";

  static examples = ["$ flowplate serve ./src/templates"];

  static flags = {};

  static args = [
    {
      name: "path",
      description:
        "Path to a folder or individual Interaction Template JSON file.",
      required: true,
    },
    {
      name: "port",
      description: "Port to run on.",
      required: false,
    },
  ];

  async run(): Promise<void> {
    const {argv, args, flags} = await this.parse(Generate)
    const {path, port} = args

    const files: File[] = await readFiles(path)
    const parsedFiles = files
    .map(file => {
      try {
        const json = JSON.parse(file.content)
        return json
      } catch {
        return null
      }
    })
    .filter(file => file !== null)

    logger.default("\n--- 🔎 Finding InteractionTemplate ---\n")
    let templates = parsedFiles.filter(file => {
      if (file?.f_type === "InteractionTemplate") {
        logger.default(`🌱 Serving InteractionTemplate id = ${file?.id}`)
        return true
      }

      return false
    })
    if (templates.length === 0)
      logger.default("\n⚠️  No InteractionTemplate found\n")
    templates = Object.fromEntries(templates.map(curr => [curr.id, curr]))

    const app = express()

    app.use(cors())

    app.get("/templates/:id", function (req: any, res: any) {
      const id = req.params.id
      const foundTemplate = templates[id]

      if (foundTemplate) {
        logger.default(
          `🌱✅ Request: http://localhost:${port}/templates/${id} => [200] InteractionTemplate with id = ${id}`,
        )
        res.json(foundTemplate)
      } else {
        logger.default(
          `🌱❌ Request: http://localhost:${port}/templates/${id} => [404] InteractionTemplate with id = ${id} not found`,
        )
        res.status(404).json({error: "Cannot find template with id = " + id})
      }
    })

    app.listen(Number(port))

    logger.default(`\n---- 🌱🚀 Server running on port ${port} ! ----\n`)
    logger.default(
      `🌱 http://localhost:${port}/templates/:template_id => InteractionTemplate`,
    )

    logger.default("---- Requests ----\n")
  }
}
