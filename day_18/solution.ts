import { SolutionBase } from '@utilities/solutionFormat'
import { Graph, astar } from 'javascript-astar'

class Point {
  x: number
  y: number

  static fromString(rep: string) {
    const split = rep.split(',').map(Number)
    if(split.length !== 2) throw new Error('Expecting format of "x,y"')
    return new Point(split)
  }
  constructor(coors: Array<number>) {
    this.x = coors[0]
    this.y = coors[1]
  }

  toString() {
    return `${this.x},${this.y}`
  }
}

/**
 * to run: npm run app -- -d 18 -f filename -1/-2 --input x,y g
 * where x,y is the total shape of the memory zone (if exit is at 70,70 pass in 71,71)
 * and g is the number of falling bytes to mark on the movement space
 *  g is required for part 1 and ignored for part 2 (so can be omitted)
 */
export default class Day18 extends SolutionBase {
  shape: Array<number>
  fallingBytes: Array<Point> = []
  memorySpace: Array<Array<number>> = []
  fallCount?: number
  searchPerformed: Map<number, number> = new Map()
  constructor(filePath: string, additionalData: Array<string>) {
    super(`${__dirname}/${filePath}`)
    this.shape = additionalData[0].split(',').map(Number)
    if (additionalData[1] !== undefined) this.fallCount = Number(additionalData[1])
    this.parseInput((line) => {
      this.fallingBytes.push(new Point(line.split(',').map(Number)))
    })
    this.resetMemory()
  }

  resetMemory() {
    this.memorySpace = Array.from({ length: this.shape[0] }, () => new Array(this.shape[1]).fill(1))
  }

  part_1(): number {
    let i = 0
    for (i = 0; i < (this.fallCount ?? this.fallingBytes.length); i++) {
      this.memorySpace[this.fallingBytes[i].y][this.fallingBytes[i].x] = 0
    }
    const graph = new Graph(this.memorySpace)
    const result = astar.search(graph, graph.grid[0][0], graph.grid[this.shape[0]-1][this.shape[1]-1])
    return result.length
  }

  part_2(): string {
    let start = 0
    let end = this.fallingBytes.length -1
    while (start <= end) {
      const mid = Math.floor((start + end) / 2)
      this.resetMemory()
      // set to mid + 1 because mid is an index and count is a count
      this.fallCount = mid + 1
      // run astar on mid
      const subAstar = this.searchPerformed.get(mid) ?? this.part_1()
      this.resetMemory()
      this.fallCount = mid
      // run astar on mid minus 1
      const lesserAstar = this.searchPerformed.get(mid - 1) ?? this.part_1()
      this.searchPerformed.set(mid, subAstar)
      this.searchPerformed.set(mid - 1, lesserAstar)

      if (lesserAstar > 0 && subAstar === 0) return this.fallingBytes[mid].toString()
      else if (subAstar === 0 && lesserAstar === 0) end = mid - 1
      else if (lesserAstar === 0 && subAstar > 0 ) throw new Error('howd you even do this')
      else start = mid + 1
    }
    return 'not found'
  }
}