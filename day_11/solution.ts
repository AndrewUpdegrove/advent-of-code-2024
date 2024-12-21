import { SolutionBase } from '@utilities/solutionFormat'


export default class Day11 extends SolutionBase {
  startingStones: Array<number> = []
  lookupTable: Map<string,number> = new Map()
  constructor(filePath: string) {
    super(`${__dirname}/${filePath}`)
    this.parseInput((line) => {
      this.startingStones = line.split(' ').map(Number)
    })
  }

  digitsAndSplit(k: number, newNumbers?: Array<number>): boolean {
    const stringRep = k.toString()
    if(stringRep.length % 2 === 0) {
      if (newNumbers !== undefined) {
        newNumbers.push(Number(stringRep.slice(0,stringRep.length / 2)), Number(stringRep.slice(stringRep.length / 2)))
      }
      return true
    }
    return false
  }

  blink(k: number, n: number): number {
    if (n === 0) return 1
    let rockCount = this.lookupTable.get(`${k},${n}`)
    const newRocks: Array<number> = []
    if(rockCount === undefined) {
      if (k === 0) {
        newRocks.push(1)
      } else if (this.digitsAndSplit(k, newRocks)) {
        // computation is being done in if statement
      } else {
        newRocks.push(k*2024)
      }
      rockCount = newRocks.reduce((acc, new_k) => acc += this.blink(new_k, n-1), 0)
      this.lookupTable.set(`${k},${n}`, rockCount)
    }
    return rockCount
  }

  part_1(): number {
    const iterations = 25
    return this.startingStones.reduce((acc, new_k) => acc += this.blink(new_k, iterations), 0)
  }

  part_2(): unknown {
    const iterations = 75
    return this.startingStones.reduce((acc, new_k) => acc += this.blink(new_k, iterations), 0)
  }
}