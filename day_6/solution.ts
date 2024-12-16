import { SolutionBase } from '@utilities/solutionFormat'
import { cloneDeep } from 'lodash'


export default class Day6 extends SolutionBase {
  labObstructionMap: Array<Array<boolean>> = [] // true means there is an obstruction
  guardStartPos: Array<number> = [] // [row, column] where [0, 0] is top left
  //guardFacing = [-1, 0] // vector indicating current walking direction for guard
  static turnForObstacle ([x, y]: Array<number>): Array<number> {
    return [y, -x]
  }

  constructor(filePath: string) {
    super(`${__dirname}/${filePath}`)
    let lineLength: number
    this.parseInput((line, rowIndex) => {
      if (lineLength === undefined) lineLength = line.length
      else if (line.length !== lineLength) throw new Error('Number of columns is varying')

      const currRow: Array<boolean> = []
      line.split('').forEach((char, colIndex) => {
        if (char === '.') currRow.push(false)
        else if (char === '#') currRow.push(true)
        else if (char === '^') {
          currRow.push(false)
          if (this.guardStartPos.length !== 0) throw new Error('Guard starting position was defined previously and is being defined again')
          this.guardStartPos = [rowIndex, colIndex]
        }
        else throw new Error(`Unexpected character encountered at (${rowIndex}, ${colIndex})when parsing map: ${char}`)
      })
      if( currRow.length !== lineLength) throw new Error('constructed a collision row that did not match the expected length')
      this.labObstructionMap.push(currRow)
    })
    if (this.guardStartPos.length === 0) throw new Error('Input map was parsed and the guards starting position was not determined')
  }

  static isOnFloor(obstructionMap: Array<Array<boolean>>, [x,y]: Array<number>): boolean {
    try {
      return obstructionMap[x][y] !== undefined
    } catch {
      return false
    }
  }

  part_1(): number{
    let stillOnMap = true
    const distinctSpace = new Set()
    let guardPos = this.guardStartPos
    let guardFacing = [-1,0]
    while (stillOnMap) {
      distinctSpace.add(`${guardPos[0]},${guardPos[1]}`)
      const nextPos = addToNewPos(guardPos, guardFacing)
      if (!Day6.isOnFloor(this.labObstructionMap, nextPos)) stillOnMap = false
      else if(this.labObstructionMap[nextPos[0]][nextPos[1]]) guardFacing = Day6.turnForObstacle(guardFacing)
      else guardPos = nextPos
    }
    return distinctSpace.size
  }

  part_2(): number {
    let stillOnMap = true
    const distinctObstruction = new Set()
    let guardPos = this.guardStartPos
    let guardFacing = [-1,0]
    // keep track of the guards path bc can't place an obstruction there later on
    const checkedPositions = new Set()
    // Don't allow an obstruction in the guards position
    checkedPositions.add(`${guardPos[0]},${guardPos[1]}`)
    while (stillOnMap) {
      const nextPos = addToNewPos(guardPos, guardFacing)
      if (!Day6.isOnFloor(this.labObstructionMap, nextPos)) stillOnMap = false
      else if(this.labObstructionMap[nextPos[0]][nextPos[1]]) guardFacing = Day6.turnForObstacle(guardFacing)
      else {
        const newMap = cloneDeep(this.labObstructionMap)
        newMap[nextPos[0]][nextPos[1]] = true
        const obstructionHash = `${nextPos[0]},${nextPos[1]}`
        if (!checkedPositions.has(obstructionHash) && isCyclical(newMap, guardPos, guardFacing)) distinctObstruction.add(obstructionHash)
        checkedPositions.add(obstructionHash)
        guardPos = nextPos
      }
    }
    return distinctObstruction.size
  }
}

function isOnFloor(obstructionMap: Array<Array<boolean>>, [x,y]: Array<number>): boolean {
  try {
    return obstructionMap[x][y] !== undefined
  } catch {
    return false
  }
}

function isCyclical (obstructionMap: Array<Array<boolean>>, startingPos: Array<number>, startingVector: Array<number>): boolean {
  const posVecSet = new Set()
  let pos = startingPos
  let vector = startingVector
  while (true) {
    const nextPos = addToNewPos(pos, vector)
    const setIndex = `${pos[0]},${pos[1]},${vector[0]},${vector[1]}`
    if (posVecSet.has(setIndex)) {
      return true
    }
    else if (!isOnFloor(obstructionMap, nextPos)) return false
    else if (obstructionMap[nextPos[0]][nextPos[1]]) vector = Day6.turnForObstacle(vector)
    else {
      posVecSet.add(setIndex)
      pos = nextPos
    }
  }
}

function addToNewPos (point: Array<number>, vector: Array<number>) {
  return [point[0]+vector[0], point[1]+vector[1]]
}