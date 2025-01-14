// import { readFileSync } from 'fs'
export interface ISolution {
  part_1: () => unknown
  part_2: (config?: unknown) => unknown
}

export abstract class SolutionBase implements ISolution {
  private inputFile: string
  /*
  constructor (filepath: string) {
    this.inputFile = filepath
  }
    */
  constructor (fileContent: string) {
    this.inputFile = fileContent
  }

  abstract part_1(): unknown
  abstract part_2(config?: unknown): unknown

  async parseInput (processLine: (line: string, index: number, array: string[]) => void): Promise<Array<number>> {
    // const data = readFileSync(this.inputFile, { encoding: 'utf-8' })
    const lines = this.inputFile.split('\n')
    const rows = lines.length
    let cols: number
    let printWarning = false
    lines.forEach((line, index, array) => {
      if (cols === undefined) cols = line.length
      else {
        if (line.length !== cols){
          printWarning = true
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
    if (printWarning) console.warn('Line length of input varies. Returning length of longest line in shape')
    return [rows, cols]
  }
}
