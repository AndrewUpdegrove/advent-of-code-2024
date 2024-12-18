import { SolutionBase } from '@utilities/solutionFormat'

class Point {
  x: number
  y: number
  constructor(x: number, y: number){
    this.x = x
    this.y = y
  }

  vectorDistanceTo(point: Point): Vector {
    return new Vector(point.x - this.x, point.y - this.y)
  }

  /**
   * 
   * @param vector Vector to use to transform the point
   * @param multiplier Optional multiplier for the vector
   * @returns a new Point after the vector transform
   */
  transformByVector(vector: Vector, multiplier: number = 1): Point {
    return new Point(this.x + (vector.dx * multiplier), this.y + (vector.dy * multiplier))
  }

  toString(): string {
    return `[${this.x},${this.y}]`
  }
}

class Area {
  topBound: number
  bottomBound: number
  leftBound: number
  rightBound: number
  constructor(topLeft: Point, bottomRight: Point) {
    this.topBound = topLeft.x
    this.leftBound = topLeft.y
    this.rightBound = bottomRight.y
    this.bottomBound = bottomRight.x
  }

  inBounds(point: Point): boolean {
    return point.x >= this.leftBound
      && point.x < this.rightBound
      && point.y >= this.topBound && point.y < this.bottomBound
  }
}

class Vector {
  dx: number
  dy: number
  constructor(x: number, y: number) {
    this.dx = x
    this.dy = y
  }

}

export default class Day8 extends SolutionBase {
  antennaRegistry: Map<string,Array<Point>> = new Map()
  mapBounds: Area
  constructor(filePath: string) {
    super(`${__dirname}/${filePath}`)
    const shape = this.parseInput((line, rowIndex) => {
      line.split('').forEach((char, colIndex) => {
        if(char !== '.') {
          if(this.antennaRegistry.has(char)) {
            // @ts-expect-error I check if the map has the key before working with it. Stop saying it could be undefined
            this.antennaRegistry.get(char).push(new Point(rowIndex,colIndex))
          } else this.antennaRegistry.set(char, [new Point(rowIndex,colIndex)])
        }
      })
    })
    this.mapBounds = new Area(new Point(0,0), new Point(shape[0], shape[1]))
  }

  part_1(): number {
    const antinodesFiltered: Set<string> = new Set()
    this.antennaRegistry.forEach((antennaLocations) => {
      antennaLocations.forEach((antenna, index, allLocs) => {
        for(let j = 0; j < allLocs.length; j++) {
          if (allLocs[j] !== antenna){
            const antinode = allLocs[j].transformByVector(antenna.vectorDistanceTo(allLocs[j]))
            if (this.mapBounds.inBounds(antinode)) antinodesFiltered.add(antinode.toString())
          }
        }
      })
    })
    console.log(antinodesFiltered)
    return antinodesFiltered.size
  }

  part_2(): number {
    const antinodesFiltered: Set<string> = new Set()
    this.antennaRegistry.forEach((antennaLocations) => {
      antennaLocations.forEach((antenna, index, allLocs) => {
        for(let j = 0; j < allLocs.length; j++) {
          if (allLocs[j] !== antenna){
            let k = 0
            let antinode = antenna.transformByVector(antenna.vectorDistanceTo(allLocs[j]), k)
            while (this.mapBounds.inBounds(antinode)) {
              console.log(antinode.toString())
              antinodesFiltered.add(antinode.toString())
              k++
              antinode = antenna.transformByVector(antenna.vectorDistanceTo(allLocs[j]), k)
            }
          }
        }
      })
    })
    return antinodesFiltered.size
  }

}