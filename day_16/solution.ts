import { alg, Graph } from '@dagrejs/graphlib'
import { SolutionBase } from '@utilities/solutionFormat'


export default class Day16 extends SolutionBase {
  // nodes in graph will be hashed using rowIndex,colIndex,dir
  // where dir is either hor or ver
  // hor and ver nodes with the same row and col will be connected
  // with an edge of weight 1000
  // adjacent nodes with the same dir will be connected with an edge
  // with a weight of 1
  mazeGraph = new Graph({ directed: false })
  mazeShape: Array<number>
  constructor(filePath: string) {
    super(`${__dirname}/${filePath}`)
    this.mazeShape = this.parseInput((line, rowIndex, fullArray) => {
      line.split('').forEach((char, colIndex) => {
        if (char !== '#') {
          this.setStandardConnections(colIndex, rowIndex, fullArray)
          if (char === 'S') this.mazeGraph.setEdge('start', `${colIndex},${rowIndex},hor`, 0)
          if (char === 'E') {
            this.mazeGraph.setEdge('end', `${colIndex},${rowIndex},hor`, 0)
            this.mazeGraph.setEdge('end', `${colIndex},${rowIndex},ver`, 0)
          }
        }
      })
    })
  }

  setStandardConnections(colIndex: number, rowIndex: number, fullInput: Array<string>): void {
    this.mazeGraph.setEdge(`${colIndex},${rowIndex},hor`, `${colIndex},${rowIndex},ver`, 1000)
    // if left is ., connect horizontal nodes
    if (colIndex + 1 < fullInput[rowIndex].length && fullInput[rowIndex][colIndex+1] !== '#') {
      this.mazeGraph.setEdge(`${colIndex},${rowIndex},hor`, `${colIndex+1},${rowIndex},hor`, 1)
    }
    // if down is a ., connect vertical nodes
    if (rowIndex + 1 < fullInput.length && fullInput[rowIndex+1][colIndex] !== '#') {
      this.mazeGraph.setEdge(`${colIndex},${rowIndex},ver`, `${colIndex},${rowIndex+1},ver`, 1)
    }
  }

  part_1(): number {
    // @ts-expect-error lib dijkstra does not support undirected graphs
    const allDistances = alg.dijkstra(this.mazeGraph, 'start', e => this.mazeGraph.edge(e), (v) => this.mazeGraph.nodeEdges(v))
    const { distance } = allDistances['end']
    return distance
  }

  part_2(): number {
    const allOptimalNodes = new Set<string>()
    const locsOnPath = new Set<string>()
    // @ts-expect-error lib dijkstra does not support undirected graphs
    const allDistances = alg.dijkstra(this.mazeGraph, 'start', e => this.mazeGraph.edge(e), (v) => this.mazeGraph.nodeEdges(v))
    const queue = this.mazeGraph.neighbors('end') as string[]
    while (queue.length > 0) {
      const currNode = queue.shift()
      if (currNode === undefined) throw new Error('attempted to shift empty queue')
      allOptimalNodes.add(currNode)
      const coordinates = currNode.match(/\d+,\d+/)
      if (coordinates === null) throw new Error(`No coordinate expression found in ${currNode}`)
      locsOnPath.add(coordinates[0])

      // @ts-expect-error really poor typing for library
      this.mazeGraph.neighbors(currNode).forEach((neighbor) => {
        if(!allOptimalNodes.has(neighbor) 
          && !['start', 'end'].includes(neighbor)
          && allDistances[currNode].distance - this.mazeGraph.edge(currNode, neighbor) === allDistances[neighbor].distance) {
          queue.push(neighbor)
        }
      })
    }
    return locsOnPath.size
  }

}