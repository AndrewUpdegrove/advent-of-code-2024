import { SolutionBase } from '@utilities/solutionFormat'

export default class Day18 extends SolutionBase {
  patterns: Array<string> = []
  towels: Set<string> 
  dpTable: Map<string, number> = new Map()
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
    initTowels.sort((a, b) => a.length - b.length)
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

  findOptimizedArrangements(pattern: string): number {
    if (pattern.length === 0) return 1
    if (this.dpTable.has(pattern)) {
      // @ts-expect-error Literally checking if defined above
      return this.dpTable.get(pattern)
    }
    let arrCount = 0
    for(const towel of this.towels) {
      if (pattern.startsWith(towel)) {
        arrCount += this.findOptimizedArrangements(pattern.slice(towel.length))
      }
    }
    this.dpTable.set(pattern, arrCount)
    return arrCount
  }


  part_1(): number {
    let count = 0
    this.patterns.forEach((pattern) => {
      if (this.findSuitableTowel(pattern)) count ++
    })
    return count
  }

  part_2(): number {
    let count = 0

    this.patterns.forEach((pattern) => {
      const out = this.findOptimizedArrangements(pattern)
      count +=  out
    })
    return count
  }

}