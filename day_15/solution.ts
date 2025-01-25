import { SolutionBase } from '@utilities/solutionFormat';

const directionMap = new Map([
  ['^',[0,-1]],
  ['>', [1,0]],
  ['v', [0,1]],
  ['<', [-1,0]]
])

enum EBoxSide {
  Left,
  Right
}

export default class Day15 extends SolutionBase {
  warehouseShape: Array<number> = []
  moves: Array<string> = []
  robotPosSmall: Array<number> = [-1,-1]
  robotPosWide: Array<number>
  wallLocationsSmall: Set<string> = new Set()
  wallLocationsWide: Set<string> = new Set()
  boxLocationsSmall: Set<string> = new Set()
  boxLocationsWide = new Map<string, EBoxSide>()
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
          if(char === '@') this.robotPosSmall = [colIndex, rowIndex]
          else if (char === '#') {
            this.wallLocationsSmall.add(Day15.stringifyPos([colIndex,rowIndex]))
            this.wallLocationsWide.add(Day15.stringifyPos([(2*colIndex), rowIndex]))
            this.wallLocationsWide.add(Day15.stringifyPos([(2*colIndex)+1, rowIndex]))
          }
          else if (char === 'O'){
            this.boxLocationsSmall.add((Day15.stringifyPos([colIndex,rowIndex])))
            this.boxLocationsWide.set(Day15.stringifyPos([(2*colIndex), rowIndex]), EBoxSide.Left)
            this.boxLocationsWide.set(Day15.stringifyPos([(2*colIndex)+1, rowIndex]), EBoxSide.Right)
          }
        })
      }
    })
    if (this.warehouseShape.length !== 2) throw new Error('Did not get the shape of the warehouse')
    if (this.robotPosSmall[0] === -1 || this.robotPosSmall[1] === -1) throw new Error('Robot was not found in parse')
    this.robotPosWide = [this.robotPosSmall[0]*2, this.robotPosSmall[1]]
  }

  part_1(): number {
    this.moves.forEach((move) => {
      const vector = directionMap.get(move)
      if (vector === undefined) throw new Error(`Move direction is not valid. Attempted: ${move}`)
      const resultingSpace = Day15.vectorTranslation(this.robotPosSmall, vector)
      let multiplier = 0
      while(true){
        multiplier++
        // Add scaled direction vector to robot pos
        const posToCheck = Day15.vectorTranslation(this.robotPosSmall, vector, multiplier)
        const stringPos = Day15.stringifyPos(posToCheck)
        if (this.wallLocationsSmall.has(stringPos)) break
        if (!this.boxLocationsSmall.has(stringPos)) {
          // add new box location
          this.boxLocationsSmall.add(stringPos)
          // remove old box location ( could remove just added location but that's ok)
          this.boxLocationsSmall.delete(Day15.stringifyPos(resultingSpace))
          // update robot pos
          this.robotPosSmall = resultingSpace
          break
          // break
        }
      }
    })
    let gpsSum = 0
    this.boxLocationsSmall.forEach((val) => gpsSum += Day15.gpsFromString(val))
    return gpsSum
  }

  part_2(): number {
    this.moves.forEach((move) => {
      const vector = directionMap.get(move)
      if (vector === undefined) throw new Error(`Move direction is not valid. Attempted: ${move}`)
      const resultingSpace = Day15.vectorTranslation(this.robotPosWide, vector)
      // handle the horizontal move differently from vertical moves
      if (['>','<'].includes(move)) {
        let moveLegal = false
        let multiplier = 0
        while(true) {
          multiplier++
          // Add scaled direction vector to robot pos
          const posToCheck = Day15.vectorTranslation(this.robotPosWide, vector, multiplier)
          const stringPos = Day15.stringifyPos(posToCheck)
          if (this.wallLocationsWide.has(stringPos)) break
          if (!this.boxLocationsWide.has(stringPos)) {
            moveLegal = true
            break
          } 
        }
        if (moveLegal) {
          // while multiplier > 1
          while (multiplier > 1) {
            // get newPos at multiplier, and relevant stringified version
            const newPos = Day15.stringifyPos(Day15.vectorTranslation(this.robotPosWide, vector, multiplier))
            // get oldPos at multiplier - 1
            const oldPos = Day15.stringifyPos(Day15.vectorTranslation(this.robotPosWide, vector, multiplier-1))
            const oldBoxSide = this.boxLocationsWide.get(oldPos)
            if (oldBoxSide === undefined) throw new Error(`Unable to move an empty box position at ${oldPos}`)
            // set newPos to val at oldPos
            this.boxLocationsWide.set(newPos, oldBoxSide)
            multiplier--
          }
          // delete box position at resulting Space
          this.boxLocationsWide.delete(Day15.stringifyPos(resultingSpace))
          // update robot position
          this.robotPosWide = resultingSpace
        }
      } else {
        const queue = new Set<string>()
        queue.add(Day15.stringifyPos(this.robotPosWide))
        const boxesToMove = new Map<string,EBoxSide>()
        let legalMove = true
        while (queue.size > 0) {
          // shift subject from queue
          const [stringSubject] = queue
          queue.delete(stringSubject) // possible bug; don't know if subject will still have string, or if delete just removes ref in queue
          const subject = Day15.posFromString(stringSubject)
          const next = Day15.vectorTranslation(subject, vector)
          const nextString = Day15.stringifyPos(next)
          // break if subject + vector is a wall
          if(this.wallLocationsWide.has(nextString)){
            legalMove = false
            break
          }
          // if subject + vector is a box
          if(this.boxLocationsWide.has(nextString)) {
            const partner = this.getPartnerBox(nextString)
            // add left and right side of box to update Map
            boxesToMove.set(nextString, this.boxLocationsWide.get(nextString) ?? EBoxSide.Left)
            boxesToMove.set(partner, this.boxLocationsWide.get(partner) ?? EBoxSide.Left)
            // add left and right side of box to queue
            queue.add(nextString).add(partner)
          }
        }
        if (legalMove) {
          boxesToMove.forEach((side, stringPos) => {
            this.boxLocationsWide.delete(stringPos)
          })
          boxesToMove.forEach((side, stringPos) => {
            this.boxLocationsWide.set(Day15.stringifyPos(Day15.vectorTranslation(Day15.posFromString(stringPos), vector)), side)
          })
          this.robotPosWide = resultingSpace
        }
      }
    })
    let gpsSum = 0
    this.boxLocationsWide.forEach((side, pos) => {
      if(side === EBoxSide.Left) gpsSum += Day15.gpsFromString(pos)
    })
    return gpsSum
  }

  getPartnerBox(pos: string): string {
    const partnerSide = this.boxLocationsWide.get(pos) === EBoxSide.Left ? [1,0] : [-1,0]
    return Day15.stringifyPos(Day15.vectorTranslation(Day15.posFromString(pos), partnerSide))
  }

  static stringifyPos(pos: Array<number>): string {
    if (pos.length !== 2) throw new Error('Only expecting 2d positions')
    return `${pos[0]},${pos[1]}`
  }

  static posFromString(pos: string): Array<number> {
    return pos.split(',').map(Number)
  }

  /**
   * 
   * @param p 2d starting position
   * @param v 2d vector
   * @param m vector scalar
   * @returns new 2d position
   */
  static vectorTranslation(p: Array<number>, v: Array<number>, m: number = 1): Array<number> {
    return v.map(x => x * m).map((val, index) => p[index] + val)
  }

  static gpsFromString(pos: string): number {
    const [x, y] = pos.split(',').map(Number)
    return x + (y * 100)
  }
}