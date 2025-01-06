import { SolutionBase } from '@utilities/solutionFormat'
import { lusolve, isInteger, format } from 'mathjs'


interface IButtonConfig {
  x: number
  y: number
}

interface IMachineConfig {
  buttonA: IButtonConfig
  buttonB: IButtonConfig 
  prizeLocation: IButtonConfig
}


export default class Day13 extends SolutionBase {
  machineConfigs: Array<IMachineConfig> = []
  constructor(filePath: string) {
    super(`${__dirname}/${filePath}`)
    let tempConfig: Partial<IMachineConfig> = {}
    this.parseInput((line, index) => {
      if (index % 4 === 3) {
        this.machineConfigs.push(tempConfig as IMachineConfig)
        tempConfig = {}
        return
      }
      const results = line.match(/[0-9]+/g)
      if (results === null) throw new Error(`No matches found for ${line}`)
      if (results.length !== 2) throw new Error(`found ${results.length} matches in line ${line}`)
      if(index % 4 === 0) {
        tempConfig.buttonA = {
          x: Number(results[0]),
          y: Number(results[1])
        }
      } else if (index % 4 === 1) {
        tempConfig.buttonB = {
          x: Number(results[0]),
          y: Number(results[1])
        }
      } else if (index % 4 === 2) {
        tempConfig.prizeLocation = {
          x: Number(results[0]),
          y: Number(results[1])
        }
      } 
    })
  }

  part_1(): number {
    let tokenCount = 0
    this.machineConfigs.forEach((config) => {
      const coefficients = [
        [config.buttonA.x, config.buttonB.x],
        [config.buttonA.y, config.buttonB.y]
      ]
      const constants = [config.prizeLocation.x, config.prizeLocation.y]
      const solutions = lusolve(coefficients, constants)
      // @ts-expect-error these type definitions are a bit nightmarish
      const pressA = Number(format(solutions[0][0], {precision: 14}))
      // @ts-expect-error these type definitions are a bit mightmarish
      const pressB = Number(format(solutions[1][0], {precision: 14}))

      if( isInteger(pressA) && isInteger(pressB)) {
        tokenCount += 3*pressA + pressB
      }
    })
    return tokenCount
  }

  part_2(): number {
    let tokenCount = 0
    this.machineConfigs.forEach((config) => {
      const coefficients = [
        [config.buttonA.x, config.buttonB.x],
        [config.buttonA.y, config.buttonB.y]
      ]
      const constants = [config.prizeLocation.x + 10000000000000, config.prizeLocation.y + 10000000000000]
      const solutions = lusolve(coefficients, constants)
      // @ts-expect-error these type definitions are a bit nightmarish
      const pressA = Number(format(solutions[0][0], {precision: 14}))
      // @ts-expect-error these type definitions are a bit mightmarish
      const pressB = Number(format(solutions[1][0], {precision: 14}))

      if( isInteger(pressA) && isInteger(pressB)) {
        tokenCount += 3*pressA + pressB
      }
    })
    return tokenCount
  }

}