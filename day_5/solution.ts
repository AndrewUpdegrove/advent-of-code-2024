import { SolutionBase } from '@utilities/solutionFormat';
import { Graph } from '@dagrejs/graphlib'

export default class Day5 extends SolutionBase {
  ruleGraph: Graph = new Graph()
  updates: Array<Array<string>> = []
  orderedUpdates: Array<Array<string>> = []
  unorderedUpdates: Array<Array<string>> = []

  constructor(filepath: string) {
    super(`${__dirname}/${filepath}`)
    const justRules: Array<Array<string>> = []
    let splitFlag = false
    this.parseInput((line) => {
      if (line === '') splitFlag = true
      else if (splitFlag) {
        this.updates.push(line.split(','))
      } else {
        justRules.push(line.split('|'))
      }

    })
    this.build_graph(justRules)
  }

  build_graph (rules: Array<Array<string>>): void {
    rules.forEach((rule) => {
      this.ruleGraph.setEdge(rule[0], rule[1])
    })
  }
  
  // sort the ordered updates from the unordered updates
  split_updates (): void {
    this.updates.forEach((update) => {
      if(this.is_ordered(update)) {
        this.orderedUpdates.push(update)
      } else {
        this.unorderedUpdates.push(update)
      }
    })
  }

  // Check if list of page updates is in order according to the rule graph
  is_ordered (update: Array<string>): boolean {
    for(let i = 0; i < update.length-1; i++) {
      if(!this.ruleGraph.hasEdge(update[i],update[i+1])) {
        return false
      }
    }
    return true
  }

  part_1 (): number {
    this.split_updates()
    let middleSum = 0
    this.orderedUpdates.forEach((update) => {
      middleSum += Number(update[Math.floor(update.length / 2)])
    })
    return middleSum
  }

  part_2 (): unknown {
    this.split_updates()
    let middleSum = 0
    this.unorderedUpdates.forEach((update) => {
      const copy = update.toSorted((a, b) => { 
        return this.ruleGraph.hasEdge(a, b) ? -1 : 1
      })
      middleSum += Number(copy[Math.floor(update.length / 2)])
    })
    return middleSum
  }

}