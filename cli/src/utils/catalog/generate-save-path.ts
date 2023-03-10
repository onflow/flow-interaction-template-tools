export function generateSavePath(path: string): string {
  return `${path}${path ? (path.slice(-1) === "/" ? "" : "/" ) : "./"}`
}