import { SolutionBase } from '@utilities/solutionFormat'


export default class Day2 extends SolutionBase {
  constructor(filepath: string) {
    super(`${__dirname}/${filepath}`)
  }

  /**
   * Takes in an array of level readings
   * Checks if they meet the critieria
   *  - Always increasing or decreasing; staying same is unsafe
   *  - Increase/decrease by at least 1 and at most 3
   * @param levels 
   * @returns Index of first criteria failure; -1 if levels are safe
   */
  safety_check (levels: Array<number>): number {
    let allowedChange
    const initAllowedChange = [1,2,3,-1,-2,-3]
    if (levels.length < 2) throw new Error('Not enough levels in report to know safety')
    let safety = -1
    for (let i = 1; i < levels.length; i++) {
      const diff = levels[i]-levels[i-1]
      if (allowedChange === undefined) {
        allowedChange = initAllowedChange.filter((val) => (val * diff) > 0)
      }
      if (!allowedChange.includes(diff)) {
        safety = i
        break
      }
    }
    return safety
  }

  // Return number of safe readings in the report
  part_1(): number {

    let safeReports = 0
    this.parseInput(( report ) => {
      const levels = report.split(/\s/).map(Number)
      const failureIndex = this.safety_check(levels)
      if (failureIndex < 0) safeReports += 1
    })
    return safeReports
  }

  // return number of safe readings accounting for the problem dampner
  part_2(): number {
    let safeReports = 0
    this.parseInput(( report ) => {
      const levels = report.split(/\s/).map(Number)
      let thingsToTry = true
      let tryFirst = true
      let justStop = true
      let firstFailure
      let adjustedLevels = levels
      while (justStop) {
        const failureIndex = this.safety_check(adjustedLevels)
        console.log(`${adjustedLevels}: failure index - ${failureIndex}`)
        if (failureIndex < 0) {
          justStop = false
          safeReports += 1
        } else if (failureIndex === 2 && tryFirst) {
          tryFirst = false
          adjustedLevels = levels.toSpliced(0, 1)
        } else if (firstFailure === undefined) {
          firstFailure = failureIndex
          adjustedLevels = levels.toSpliced(firstFailure - 1, 1)
        } else if (thingsToTry) {
          adjustedLevels = levels.toSpliced(firstFailure, 1)
          thingsToTry = false
        } else {
          justStop = false
        }
      }
    })
    return safeReports
  }
}