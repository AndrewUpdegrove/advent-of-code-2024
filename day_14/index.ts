import Day14 from "./solution"

let counter = -1
const canvas = <HTMLCanvasElement>document.getElementById('patrol')
if (canvas === null) throw new Error('Active web page does not contain a patrolmap')
const ctx = canvas.getContext("2d")
const nextButt = document.getElementById('advance')
if (nextButt === null) throw new Error('No next button')
const title = document.getElementById('timestep')

const input = prompt('What file to use?')
const shape = prompt('What are the dimensions of the patrol space? format: w,h')
if (shape === null) throw new Error('gotta tell me the patrol area size bub')
const solution = new Day14(`${input}.txt`, ['100', shape])

function updateScreen(positions: Array<Array<number>>) {
  if (title === null) throw new Error('need title')
  if (ctx === null) throw new Error('somehow context is null')
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  title.innerHTML = `Timestep: ${counter}`
  positions.forEach((pos) => {
    ctx.fillRect(pos[0], pos[1], 1, 1)
  })
}

function findNextSymPos() {
  let timeToDraw: boolean = false
  let newPositions: Array<Array<number>> = []
  while (!timeToDraw && counter <= 100) {
    counter++
    const {isSymmetrical, positions } = solution.part_2(counter)
    newPositions = positions
    timeToDraw ||= isSymmetrical
  }
  if (counter > 100) console.log('counter too high')
  updateScreen(newPositions)
}


nextButt.addEventListener('click', findNextSymPos)

// get input on what file to use
// instantiate new day 14
// Function check pos:
  // call part 2 with an timestep to check
  // iterate until part_2 returns a true
// Function draw
  // draw the positions on the canvas
  // update title with current count
// attach check_pos and draw to nextbut