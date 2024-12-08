import type { ISolution } from '@utilities/solutionFormat';
import { ArgumentParser } from 'argparse'
//import { version } from './package.json'
 
const parser = new ArgumentParser({
  description: 'CLI activation solution'
});
 
parser.add_argument('-d', '--day', {type: 'int', required: true, help: 'Day of the puzzle to run, integer'})
parser.add_argument('-f', '--file', { type: 'str', required: true, help: 'what input file to run the parts on automatically adds .txt'});
parser.add_argument('-1', '--one', { action: 'store_true', help: 'Run part 1 of the solution; if neither 1 or 2 flag are supplied both are run'})
parser.add_argument('-2', '--two', { action: 'store_true', help: 'run part 2 of the solution; if neither 1 or 2 flag are supplied both are run'});

const args = parser.parse_args()

import(`day_${args.day}/solution`).then((sol) => {
  const Solution = sol.default
  const runner: ISolution = new Solution(`${args.file}.txt`)
  if (args.one || args.one === args.two) {
    console.log(runner.part_1())
  }
  if (args.two || args.two === args.one) {
    console.log(runner.part_2())
  }
})