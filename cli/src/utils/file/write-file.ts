import fs from "node:fs"
import path from "path"

export async function writeFile(filePath: string, content: any): Promise<void> {
  return new Promise((res, rej) => {
    var dirname = path.dirname(filePath);
    if (!fs.existsSync(dirname)) {
      console.log("making dir", dirname, filePath)
      fs.mkdirSync(dirname, {recursive: true});  
    }

    fs.writeFile(filePath, content, {
      encoding: "utf8",
      flag: "w",
      mode: 0o666
    }, err => {
      if (err)
        rej(err)
      else {
        res()
      }
    })
  })
}
