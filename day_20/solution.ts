import { SolutionBase } from '@utilities/solutionFormat'
import { Graph, alg } from '@dagrejs/graphlib'

export default class Day20 extends SolutionBase {
  trackGraph = new Graph({ directed: false })
  cheatMap = new Map<string, number>()
  static wallWeight = 10000
  constructor(filePath: string) {
    super(`${__dirname}/${filePath}`)
    this.parseInput((line, rowIndex, allRows) => {
      line.split('').forEach((char, colIndex) => {
        if (char !== '#') {
          // make connection right
          this.trackGraph.setEdge(
            `${rowIndex},${colIndex}`,
            `${rowIndex},${colIndex+1}`,
            {
              wall: allRows[rowIndex][colIndex+1] === '#',
              weight: 1
            }
          )
          // make connection up
          this.trackGraph.setEdge(
            `${rowIndex},${colIndex}`,
            `${rowIndex-1},${colIndex}`,
            {
              wall: allRows[rowIndex-1][colIndex] === '#',
              weight: 1
            }
          )
          // make connection down
          this.trackGraph.setEdge(
            `${rowIndex},${colIndex}`,
            `${rowIndex+1},${colIndex}`,
            {
              wall: allRows[rowIndex+1][colIndex] === '#',
              weight: 1
            }
          )
          // make connection left
          this.trackGraph.setEdge(
            `${rowIndex},${colIndex}`,
            `${rowIndex},${colIndex-1}`,
            {
              wall: allRows[rowIndex][colIndex-1] === '#',
              weight: 1
            }
          )
          if (char === 'S') {
            this.trackGraph.setEdge('start',`${rowIndex},${colIndex}`, { wall: false, weight: 0})
            this.trackGraph.setNode(`${rowIndex},${colIndex}`, 'path')
          } else if (char === 'E') {
            this.trackGraph.setEdge('end',`${rowIndex},${colIndex}`, { wall: false, weight: 0})
            this.trackGraph.setNode(`${rowIndex},${colIndex}`, 'path')
          } else {
            this.trackGraph.setNode(`${rowIndex},${colIndex}`, 'path')
          }
        } else {
          this.trackGraph.setNode(`${rowIndex},${colIndex}`, 'wall') 
        }
      })
    })

  }

  part_1(): number {
    const allDistances = alg.dijkstra(
      this.trackGraph,
      'end',
      (e) => this.trackGraph.edge(e).wall ? Day20.wallWeight : this.trackGraph.edge(e).weight,
      // @ts-expect-error lib dijkstra does not support undirected graphs
      (v) => this.trackGraph.nodeEdges(v)
    )
    const nodesOnPath: Array<string> = []
    // trace back through all distances putting together all nodes on the path
    let itback = allDistances.start.predecessor
    while (itback !== 'end'){
      nodesOnPath.push(itback)
      itback = allDistances[itback].predecessor
    }
    // iterate through all the nodes:
    nodesOnPath.forEach((node) => {
      // @ts-expect-error neighbors return type is wrong
      this.trackGraph.neighbors(node).forEach((neighbor: string) => {
      // check for connected walls
        if (this.trackGraph.node(neighbor) === 'wall') {
          // find if that wall has an open node connnected to it directly opposite 
          const tunneled = this.getOppositeNode(node, neighbor)
          if ( (this.trackGraph.node(tunneled) ?? 'dne') === 'path') {
            // check distance to end from opposite node, time_diff = old dist - new distance - 2
            const time_diff = allDistances[node].distance - allDistances[tunneled].distance - 2
            // if time_diff is positive, add to map <start_node, end_node> = end
            if (time_diff > 0) this.cheatMap.set(`${node}|${tunneled}`, time_diff)
          }
        }
      })
    })
    
    return [...this.cheatMap.values().filter((time_saved) => time_saved >= 100)].length
  }

  stringToCoor(v: string): Array<number> {
    return v.split(',').map(Number)
  }
  // wall index minus node index, then added to wall index
  getOppositeNode(v: string, w: string): string {
    const coorW = this.stringToCoor(w)
    const resultCoor = this.stringToCoor(v).map((val, i) => (coorW[i] - val) + coorW[i])
    return `${resultCoor[0]},${resultCoor[1]}`
  }

  part_2(): unknown {
    throw new Error('not implemented')
  }
}