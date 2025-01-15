import { SolutionBase } from '@utilities/solutionFormat';

const directionMap = new Map([
  ['^',[0,-1]],
  ['>', [1,0]],
  ['v', [0,1]],
  ['<', [-1,0]]
])

export default class Day15 extends SolutionBase {
  warehouseShape: Array<number> = []
  moves: Array<string> = []
  warehouse: Array<Array<string>> = []
  robotPos: Array<number> = [-1,-1]
  wallLocations: Set<string> = new Set()
  boxLocations: Set<string> = new Set()
  constructor(filePath: string) {
    super(`${__dirname}/${filePath}`)
    let parseMoves = false
    this.parseInput((line, rowIndex) => {
      if (line === '') {
        this.warehouseShape.push(rowIndex-1)
        parseMoves = true
        return
      }

      if(parseMoves) {
        this.moves.push(...line.split(''))
      } else {
        if(this.warehouseShape.length === 0) {
          this.warehouseShape.push(line.length)
        }
        line.split('').forEach((char, colIndex) => {
          if(char === '@') this.robotPos = [colIndex, rowIndex]
          else if (char === '#') this.wallLocations.add(Day15.stringifyPos([colIndex,rowIndex]))
          else if (char === 'O') this.boxLocations.add((Day15.stringifyPos([colIndex,rowIndex])))
        })
      }
    })
    if (this.warehouseShape.length !== 2) throw new Error('Did not get the shape of the warehouse')
    if (this.robotPos[0] === -1 || this.robotPos[1] === -1) throw new Error('Robot was not found in parse')
  }

  part_1(): number {
    this.moves.forEach((move) => {
      const vector = directionMap.get(move)
      if (vector === undefined) throw new Error(`Move direction is not valid. Attempted: ${move}`)
      const resultingSpace = this.robotPos.map((val, index) => vector[index] + val)
      let multiplier = 0
      while(true){
        multiplier++
        // Add scaled direction vector to robot pos
        const posToCheck = vector.map(x => x * multiplier).map((val, index) => this.robotPos[index] + val)
        const stringPos = Day15.stringifyPos(posToCheck)
        if (this.wallLocations.has(stringPos)) break
        if (!this.boxLocations.has(stringPos)) {
          // add new box location
          this.boxLocations.add(stringPos)
          // remove old box location ( could remove just added location but that's ok)
          this.boxLocations.delete(Day15.stringifyPos(resultingSpace))
          // update robot pos
          this.robotPos = resultingSpace
          break
          // break
        }
      }
    })
    let gpsSum = 0
    this.boxLocations.forEach((val) => gpsSum += Day15.gpsFromString(val))
    return gpsSum
  }

  part_2(): unknown {
    throw new Error('not implemented')
  }

  static stringifyPos(pos: Array<number>): string {
    if (pos.length !== 2) throw new Error('Only expecting 2d positions')
    return `${pos[0]},${pos[1]}`
  }

  static gpsFromString(pos: string): number {
    const [x, y] = pos.split(',').map(Number)
    return x + (y * 100)
  }
}