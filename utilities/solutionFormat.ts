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

  parseInput (processLine: (line: string, index: number, array: string[]) => void): Array<number> {
    const data = readFileSync(this.inputFile, { encoding: 'utf-8' })
    const lines = data.split('\n')
    const rows = lines.length
    let cols: number
    lines.forEach((line, index, array) => {
      if (cols === undefined) cols = line.length
      else {
        if (line.length !== cols){
          console.warn('Line length of input varies. Returning length of longest line in shape')
          if (line.length > cols) cols = line.length
        }
      }
      processLine(line, index, array)
    })
    // @ts-expect-error cols used before being assigned. I know. that's why I'm checking if its undefined
    if (cols === undefined) {
      console.warn('No lines were processed')
      cols = 0
    }
    return [rows, cols]
  }
}
