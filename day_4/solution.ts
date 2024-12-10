import { SolutionBase } from '@utilities/solutionFormat';


export default class Day4 extends SolutionBase {
  constructor(filepath: string) {
    super(`${__dirname}/${filepath}`)
  }


  part_1(): number {
    const rows: Array<string> = []
    const columns: Array<string> = [] 
    const diagRight: Array<string> = []
    const diagLeft: Array<string> = []

    this.parseInput((line, rowIndex, all) => {
      rows.push(line)
      const chars = line.split('')
      chars.forEach((char, colIndex) => {
        // add to columns
        if (columns[colIndex] === undefined) columns[colIndex] = ''
        columns[colIndex] += char

        // add to left down diag
        const interestDiagLeft = colIndex + rowIndex
        if (diagLeft[interestDiagLeft] === undefined) diagLeft[interestDiagLeft] = ''
        diagLeft[interestDiagLeft] += char

        // add to right down diag
        const interestDiagRight = colIndex + (all.length - rowIndex - 1)
        if (diagRight[interestDiagRight] === undefined) diagRight[interestDiagRight] = ''
        diagRight[interestDiagRight] += char
      })
    })
    const allStrings = [
      ...rows,
      ...columns,
      ...diagLeft,
      ...diagRight
    ]
    const forwardMatch = /(XMAS)/g
    const backwardMatch = /(SAMX)/g
    let xmasCount = 0
    allStrings.forEach((line) => {
      xmasCount += (line.match(forwardMatch) ?? []).length
      xmasCount += (line.match(backwardMatch) ?? []).length
    })
    return xmasCount
  }

  part_2(): number {
    const diagRight: Array<string> = []
    const diagLeft: Array<string> = []
    let numRows: number
    let numCols: number

    this.parseInput((line, rowIndex, all) => {
      numRows = all.length
      numCols = line.length
      const chars = line.split('')
      chars.forEach((char, colIndex) => {

        // add to left down diag
        const interestDiagLeft = colIndex + rowIndex
        if (diagLeft[interestDiagLeft] === undefined) diagLeft[interestDiagLeft] = ''
        diagLeft[interestDiagLeft] += char

        // add to right down diag
        const interestDiagRight = colIndex + (all.length - rowIndex - 1)
        if (diagRight[interestDiagRight] === undefined) diagRight[interestDiagRight] = ''
        diagRight[interestDiagRight] += char
      })
    })
    let array1;
    const diagLeftIndexes: Array<Array<number>> = []
    const diagRightIndexes: Array<Array<number>> = []

    diagLeft.forEach((line, diagIndex) => {
      const regexForward = RegExp(/(MAS)/, 'g')
      const regexBackward = RegExp(/(SAM)/, 'g')
      while ((array1 = regexForward.exec(line)) !== null) {
        const aLoc = array1.index + 1
        diagLeftIndexes.push([ aLoc + Math.max(0, diagIndex - (numCols - 1)), Math.min(diagIndex, numCols - 1) - aLoc])
      }
      while ((array1 = regexBackward.exec(line)) !== null) {
        const aLoc = array1.index + 1
        diagLeftIndexes.push([ aLoc + Math.max(0, diagIndex - (numCols - 1)), Math.min(diagIndex, numCols - 1) - aLoc])
      }
    })
    diagRight.forEach((line, diagIndex) => {
      const regexForward = RegExp(/(MAS)/, 'g')
      const regexBackward = RegExp(/(SAM)/, 'g')
      while ((array1 = regexForward.exec(line)) !== null) {
        const aLoc = array1.index + 1
        diagRightIndexes.push([aLoc+Math.max((numRows-1) - diagIndex, 0), aLoc+Math.max(diagIndex - (numRows - 1), 0)])
      }
      while ((array1 = regexBackward.exec(line)) !== null) {
        const aLoc = array1.index + 1
        diagRightIndexes.push([aLoc+Math.max((numRows-1) - diagIndex, 0), aLoc+Math.max(diagIndex - (numRows - 1), 0)])
      }
    })

    let xmasCount = 0
    diagLeftIndexes.forEach((pair1) => {
      diagRightIndexes.forEach((pair2) => {
        if(this.compareArrays(pair1,pair2)) xmasCount += 1
      })
    })
    return xmasCount
    
  }
  compareArrays<T> (a: Array<T>, b: Array<T>): boolean {
    return a.length === b.length &&
      a.every((element, index) => element === b[index]);
  }

}