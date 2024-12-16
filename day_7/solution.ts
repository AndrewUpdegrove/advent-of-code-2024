import { SolutionBase } from '@utilities/solutionFormat'
import { clone } from 'lodash'


export default class Day7 extends SolutionBase {
  constructor(filePath: string) {
    super(`${__dirname}/${filePath}`)
  }

  // expecting array to be passed in "backwards"
  // because using division and subtraction and looking from "left-to-right" to
  // ignore impossible multiplication combinations early
  two_operator_recurse(numbers: Array<number>, target: number): boolean {
    if (target === 0) return true
    else if (target < 0) return false
    else if (numbers.length === 0) return false
    else {
      const divideCheck = clone(numbers)
      const nextNumber = divideCheck.shift()
      const subtractCheck = clone(divideCheck)
      if (nextNumber === undefined) throw new Error('Got an undefined element after shifting operators array')
      let isPossible = false
      if (target % nextNumber === 0) isPossible ||= this.two_operator_recurse(divideCheck, target / nextNumber)
      isPossible ||= this.two_operator_recurse(subtractCheck, target - nextNumber)
      return isPossible
    }
  }

  // pass array in the noraml parsing, left to right
  three_operator_recurse(numbers: Array<number>, target: number): boolean {
    if (numbers[0] > target) return false
    else if (numbers.length === 1) {
      if (numbers[0] === target) return true
      else return false
    } else {
      const addCheck =  clone(numbers)
      const firstOperator = addCheck.shift()
      const secondOperator = addCheck.shift()
      if (firstOperator === undefined || secondOperator === undefined) throw new Error('Got an undefined element after shifting operators array')
      const multiplycheck = clone(addCheck)
      const concatCheck = clone(addCheck)
      addCheck.unshift(firstOperator+secondOperator)
      multiplycheck.unshift(firstOperator*secondOperator)
      concatCheck.unshift(Number(`${firstOperator}${secondOperator}`))
      let isPossible = false
      isPossible ||= this.three_operator_recurse(addCheck, target)
      isPossible ||= this.three_operator_recurse(multiplycheck, target)
      isPossible ||= this.three_operator_recurse(concatCheck, target)
      return isPossible
    }
  }

  part_1(): number {
    let sum = 0
    this.parseInput((line) => {
      const [testValueString, spaceyOperators] = line.split(':')
      const testValue = Number(testValueString)
      const operators = spaceyOperators.split(' ').slice(1).map(Number).reverse()
      sum += this.two_operator_recurse(operators, testValue) ? testValue : 0
    })
    return sum
  }

  part_2(): number {
    let sum = 0
    this.parseInput((line) => {
      const [testValueString, spaceyOperators] = line.split(':')
      const testValue = Number(testValueString)
      const operators = spaceyOperators.split(' ').slice(1).map(Number)
      sum += this.three_operator_recurse(operators, testValue) ? testValue : 0
    })
    return sum
  }

}