import { SolutionBase } from '@utilities/solutionFormat'


export default class Day12 extends SolutionBase {
  plantingMap: Array<Array<string>> = []
  plotCounted: Set<string> = new Set()
  shape: Array<number>
  constructor(filePath: string) {
    super(`${__dirname}/${filePath}`)
    this.shape = this.parseInput((line) => {
      this.plantingMap.push(line.split(''))
    })
  }

  calculateRegion(startingPlot: Array<number>) : number {
    const plotTracking = [startingPlot]
    const plant = this.plantingMap[startingPlot[0]][startingPlot[1]]
    let area = 0
    let perimeter = 0
    while(plotTracking.length > 0) {
      const currPlot = plotTracking.shift()
      if (currPlot === undefined) throw new Error('somehow shifted on empty array')
      const [row, col] = currPlot
      if (this.plotCounted.has(`${row},${col}`)) continue
      const rowBelow = row+1; const rowAbove = row-1
      const colRight = col+1; const colLeft = col-1

      // plot below
      if (rowBelow < this.shape[0]) {
        if (this.plantingMap[rowBelow][col] === plant) {
          if (!this.plotCounted.has(`${rowBelow},${col}`)) plotTracking.push([rowBelow, col])
        } else perimeter += 1
      } else perimeter+=1
      // plot above
      if (rowAbove >= 0) {
        if (this.plantingMap[rowAbove][col] === plant) {
          if (!this.plotCounted.has(`${rowAbove},${col}`)) plotTracking.push([rowAbove, col])
        } else perimeter += 1
      } else perimeter += 1
      // plot to the right
      if (colRight < this.shape[1]) {
        if (this.plantingMap[row][colRight] === plant) {
          if (!this.plotCounted.has(`${row},${colRight}`)) plotTracking.push([row, colRight])
        } else perimeter += 1
      } else perimeter += 1
      // plot to the left
      if (colLeft >= 0) {
        if (this.plantingMap[row][colLeft] === plant) {
          if (!this.plotCounted.has(`${row},${colLeft}}`)) plotTracking.push([row, colLeft])
        } else perimeter += 1
      } else perimeter += 1


      area += 1
      this.plotCounted.add(`${row},${col}`)
    }
    return area * perimeter
  }

  part_1(): number {
    
    let fencingSum = 0
    this.plantingMap.forEach((row, rowIndex) => {
      row.forEach((plot, colIndex) => {
        if (!this.plotCounted.has(`${rowIndex},${colIndex}`)) {
          fencingSum += this.calculateRegion([rowIndex, colIndex])
        }
      })
    })
    return fencingSum
  }

  part_2(): unknown {
    throw new Error('not implemented')
  }
}