import { SolutionBase } from '@utilities/solutionFormat';


export default class Day3 extends SolutionBase {
  constructor(filepath: string) {
    super(`${__dirname}/${filepath}`)
  }

  part_1(): number {

    let sum = 0
    const regexMatch = /mul\((\d+),(\d+)\)/g
    this.parseInput(( line: string ) => {
      line.matchAll(regexMatch).forEach((match) => {
        sum += Number(match[1]) * Number(match[2])
      })
    })
    return sum
  }

  part_2(): number {
    let sum = 0
    const regexMatch = /mul\((\d+),(\d+)\)|do\(\)|don't\(\)/g
    let do_sum = true
    this.parseInput(( line: string ) => {
      line.matchAll(regexMatch).forEach((match) => {
        if (match[0].startsWith('don\'t')) do_sum = false
        else if (match[0].startsWith('do')) do_sum = true
        else if (do_sum) sum += Number(match[1]) * Number(match[2])
      })
    })
    return sum
  }
}