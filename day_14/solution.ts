import { SolutionBase } from '@utilities/solutionFormat';

/**
 * when triggered from the command line, requires use of the input flag with two additional ordered inputs:
 * --inputs t w,h
 * where 't' is the number of time steps, 'w' is the patrol area width, and 'h' is the patrol area height
 */
export default class Day14 extends SolutionBase {
  /**
   * Array of robot details, format: [p_x, p_y, v_x, v_y]
   * 0,0 is top left of grid
   */
  robots: Array<Array<number>> = []
  // Shape of the patrol area: [width, height]
  patrolArea: Array<number>
  timeStep: number
  constructor(filePath: string, additionalData: Array<string>) {
    super(`${__dirname}/${filePath}`)
    this.timeStep = Number(additionalData[0])
    this.patrolArea = additionalData[1].split(',').map(Number)
    this.parseInput((line, index) => {
      const matches = line.match(/-*\d+/g)
      if (matches === null) {
        console.warn(`No matches found on ${index}`)
        return
      }
      if (matches.length != 4) throw new Error(`Found ${matches.length} on line ${index}`)
      this.robots.push(matches.map(Number))
    })
  }

part_1(): number {
  // top-left, top-right, bottom-left, bottom-right
  const gridCount: Array<number> = [0, 0, 0, 0]
  const verticalDivide = Math.floor(this.patrolArea[0] / 2)
  const horizontalDivide = Math.floor(this.patrolArea[1] / 2)
  this.robots.forEach((moveSet) => {
    let resolvedX = (moveSet[0] + (moveSet[2] * this.timeStep)) % this.patrolArea[0]
    let resolvedY = (moveSet[1] + (moveSet[3] * this.timeStep)) % this.patrolArea[1]
    if (resolvedX < 0 ) resolvedX += this.patrolArea[0]
    if (resolvedY < 0 ) resolvedY += this.patrolArea[1]
    if (resolvedX < verticalDivide && resolvedY < horizontalDivide) gridCount[0] += 1
    if (resolvedX > verticalDivide && resolvedY < horizontalDivide) gridCount[1] += 1
    if (resolvedX < verticalDivide && resolvedY > horizontalDivide) gridCount[2] += 1
    if (resolvedX > verticalDivide && resolvedY > horizontalDivide) gridCount[3] += 1
  })
  return gridCount.reduce((acc, curr) => acc * curr)
  }

  part_2(): unknown {
    throw new Error('Please side branch for the egregious solution that was written')
  }

}