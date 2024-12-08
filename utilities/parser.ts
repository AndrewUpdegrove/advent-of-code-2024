import { readFileSync } from 'fs'

export function parseInput (filepath : string, processLine: (line: string) => void): void {
  const data = readFileSync(filepath, { encoding: 'utf-8' })
  const lines = data.split('\n')
  lines.forEach((line) => {
    processLine(line)
  })
}
