import { readFileSync } from 'fs'
export interface ISolution {
  part_1: () => unknown
  part_2: () => unknown
}

export abstract class SolutionBase implements ISolution {
  private inputFile: string
  constructor (filepath: string) {
    this.inputFile = filepath
  }

  abstract part_1(): unknown
  abstract part_2(): unknown

  parseInput (processLine: (line: string) => void): void {
    const data = readFileSync(this.inputFile, { encoding: 'utf-8' })
    const lines = data.split('\n')
    lines.forEach((line) => {
      processLine(line)
    })
  }
}
