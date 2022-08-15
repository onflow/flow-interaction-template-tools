import { File } from "../file/read-files";

export interface iTemplateMonad {
  flowJSON?: { [key: string]: any };
  file: File;
  type: string;
  iface: string;
  messages: { [key: string]: any };
  cadence: string;
  dependencies: { [key: string]: any };
  args: { [key: string]: any };
}

export const generateTemplateMonad = (
  file: File,
  flowJSON?: { [key: string]: any }
): iTemplateMonad => ({
  flowJSON,
  file,
  type: "",
  iface: "",
  messages: {},
  cadence: file.content,
  dependencies: {},
  args: {},
});
