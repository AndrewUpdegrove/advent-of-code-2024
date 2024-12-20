import { SolutionBase } from '@utilities/solutionFormat'
import { alg, Graph } from '@dagrejs/graphlib'


export default class Day10 extends SolutionBase {
  // Directed graph where for an edge a -> b, a is one less than b
  trailGraph: Graph = new Graph()
  // A mapping from heights to their locations in the grid
  heightPositionMap: Map<number, Set<string>> = new Map()

  constructor(filepath: string) {
    super(`${__dirname}/${filepath}`)
    this.heightPositionMap = new Map([
      [0, new Set()],
      [1, new Set()],
      [2, new Set()],
      [3, new Set()],
      [4, new Set()],
      [5, new Set()],
      [6, new Set()],
      [7, new Set()],
      [8, new Set()],
      [9, new Set()]
    ])

    // construct directed graph from topographical map by iterating
    // through each node and checking if it is one less or more than
    // the nodes directly to the right and below it
    this.parseInput((line, rowIndex, allLines) => {
      for(let i = 0; i < line.length ; i++) {
        const focusHash = `${rowIndex},${i}`
        this.trailGraph.setNode(focusHash, line[i])

        this.heightPositionMap.get(Number(line[i]))?.add(focusHash)
        if (i + 1 < line.length) {
          // if element to right is one greater 
          if (Number(line[i]) + 1 === Number(line[i+1])) {
            // add edge from focus to right node
            this.trailGraph.setEdge(focusHash, `${rowIndex},${i+1}`)
          }
          // if element to right is one less, 
          if (Number(line[i]) - 1 === Number(line[i+1])) {
            // add edge from right node to focus
            this.trailGraph.setEdge(`${rowIndex},${i+1}`,focusHash)
          }
        }
        // Handle element directly below
        // check that we aren't out of rows below
        if (rowIndex + 1 < allLines.length) {
          // if element below is one greater, 
          if (Number(line[i]) + 1 === Number(allLines[rowIndex+1][i])) {
            //add edge from focus to below
            this.trailGraph.setEdge(focusHash, `${rowIndex+1},${i}`)
          }

          // if element below is one less, 
          if (Number(line[i]) - 1 === Number(allLines[rowIndex+1][i])) {
            this.trailGraph.setEdge(`${rowIndex+1},${i}`, focusHash)
          }
        }
      }
    })
  }

  part_1(): number {
    // use dijkstra's to know if there is a path between each trail and each peak
    let mapScore = 0
    this.heightPositionMap.get(0)?.forEach((headHash) => {
      const shortestPathMap = alg.dijkstra(this.trailGraph, headHash)
      this.heightPositionMap.get(9)?.forEach((peakHash) => {
        if(shortestPathMap[peakHash].distance !== Number.POSITIVE_INFINITY) mapScore++
      })
    })
    return mapScore
  }

  part_2(): unknown {
    // BFS through graph starting from each head
    let mapScore = 0
    this.heightPositionMap.get(0)?.forEach((headHash) => {
      let headScore = 0
      const bfsNodes = [headHash]
      while(bfsNodes.length > 0) {
        const curNode = bfsNodes.shift()
        if(curNode === undefined) throw new Error('somehow shifting out an undefined element')
        if(this.trailGraph.node(curNode) === '9') headScore++
        else {
          const nextNodes = this.trailGraph.successors(curNode)
          if (nextNodes !== undefined) bfsNodes.push(...nextNodes)
        }
      }
      mapScore += headScore
    })
    return mapScore
  }
}