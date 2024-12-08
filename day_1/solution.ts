import { SolutionBase } from '@utilities/solutionFormat'


export default class Day1 extends SolutionBase {
  constructor(filepath: string) {
    super(`${__dirname}/${filepath}`)

  }
  part_1() {
    const locID1: number[] = []
    const locID2: number[] = []
    this.parseInput((line) => {
      const [loc1, loc2] = line.split('  ')
      locID1.push(Number(loc1))
      locID2.push(Number(loc2))
    })
    locID1.sort()
    locID2.sort()

    const cumDist = locID1.reduce((cum, curr, index) => {
      cum += Math.abs(curr - locID2[index])
      return cum
    }, 0)
    return cumDist
  }

  part_2() {
    const locMapRight = new Map<number, number>()
    const locMapLeft = new Map<number, number>()
    this.parseInput((line) => {
      const [loc1, loc2] = line.split('  ').map(Number)
      locMapLeft.set(loc1, (locMapLeft.get(loc1) ?? 0) + 1)
      locMapRight.set(loc2, (locMapRight.get(loc2) ?? 0) + 1)

    })
    let similarity = 0
    locMapLeft.forEach( (occur, id) => {
      similarity += (id * occur * (locMapRight.get(id) ?? 0))
    })
    return similarity
  }
}
