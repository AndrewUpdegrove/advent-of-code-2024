import { readFileSync } from 'fs'


function parse_input(filepath: string, processLine: (line: string) => void): void {
  const data = readFileSync(filepath, { encoding: 'utf-8' })
  const lines = data.split('\n')
  lines.forEach((line) => {
    processLine(line)
  })
}

function part_1(filepath: string) {
  const locID1: number[] = []
  const locID2: number[] = []
  parse_input(filepath, (line) => {
    const [loc1, loc2] = line.split('  ')
    locID1.push(Number(loc1))
    locID2.push(Number(loc2))
  })
  locID1.sort()
  locID2.sort()

  const cumDist = locID1.reduce((cum, curr, index) => {
    cum += Math.abs(curr - locID2[index])
    return cum
  }, 0)
  return cumDist
}

function part_2(filepath: string) {
  const locMapRight = new Map<number, number>()
  const locMapLeft = new Map<number, number>()
  parse_input(filepath, (line) => {
    const [loc1, loc2] = line.split('  ').map(Number)
    locMapLeft.set(loc1, (locMapLeft.get(loc1) ?? 0) + 1)
    locMapRight.set(loc2, (locMapRight.get(loc2) ?? 0) + 1)

  })
  let similarity = 0
  locMapLeft.forEach( (occur, id) => {
    similarity += (id * occur * (locMapRight.get(id) ?? 0))
  })
  return similarity
}

const filepath = 'day_1/input.txt'
console.log(`Solution 1: ${part_1(filepath)}`)
console.log(`Solution 2: ${part_2(filepath)}`)