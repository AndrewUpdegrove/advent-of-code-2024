import { SolutionBase } from '@utilities/solutionFormat'

export default class Day18 extends SolutionBase {
  patterns: Array<string> = []
  towels: Set<string> 
  constructor(filePath: string) {
    super(`${__dirname}/${filePath}`)
    const initTowels: Array<string> = []
    this.parseInput((line, index) => {
      if (index > 1) {
        this.patterns.push(line)
      }
      if (index === 0) {
        initTowels.push(...line.split(', '))
      }
    })
    this.towels = new Set(initTowels)
  }

  findSuitableTowel(pattern: string): boolean {
    if (pattern.length === 0) return true
    let index = 0
    while (index < pattern.length) {
      let recurseResult = false
      if (this.towels.has(pattern.slice(0, index+1))) {
        recurseResult = this.findSuitableTowel(pattern.slice(index+1))
      }
      if (recurseResult) return true
      index++
    }
    return false
  }

  findAllArrangements(pattern: string): number {
    if (pattern.length === 0) return 1
    let index = 0
    let total = 0
    while (index < pattern.length) {
      if (this.towels.has(pattern.slice(0, index+1))) {
        total += this.findAllArrangements(pattern.slice(index+1))
      }
      index++
    }
    return total
  }


  part_1(): number {
    let count = 0
    this.patterns.forEach((pattern) => {
      if (this.findSuitableTowel(pattern)) count ++
    })
    return count
  }

  part_2(): unknown {
    let count = 0
    this.patterns.forEach((pattern, index, all) => {
      console.log(`Processing ${index} of ${all.length}`)
      count += this.findAllArrangements(pattern)
    })
    return count
  }

}