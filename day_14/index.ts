import Day14 from "./solution"

let counter = -1
let interval = 1
const scale = <HTMLInputElement> document.getElementById('scale')
const counterInput = <HTMLInputElement> document.getElementById('counter')
const counterSubmit = document.getElementById('counterSubmit')
const intervalInput = <HTMLInputElement> document.getElementById('interval')
const intervalSubmit = document.getElementById('intervalSubmit')
if (counterInput === null) throw new Error('counter pls')
if (counterSubmit === null) throw new Error('counter submit pls')
if (intervalInput === null) throw new Error('interval pls')
if (intervalSubmit === null) throw new Error('interval submit pls')
counterSubmit.addEventListener('click', () => {
  counter = Number(counterInput.value)
})
intervalSubmit.addEventListener('click', () => {
  interval = Number(intervalInput.value)
})

let solution: Day14
const canvas = <HTMLCanvasElement>document.getElementById('patrol')
if (canvas === null) throw new Error('Active web page does not contain a patrolmap')
const ctx = canvas.getContext("2d")
const nextButt = document.getElementById('advance')
if (nextButt === null) throw new Error('No next button')
const title = document.getElementById('timestep')

function resolveNext() {
  const filelist = inputelement.files
  if (filelist === null) throw new Error('i don\'t even know now')
  const selectedFile = filelist[0]
  const reader = new FileReader()
  reader.addEventListener(
    "load",
    () => {
      // this will then display a text file
      kickOff(<string>reader.result)
    },
    false,
  );
  reader.readAsText(selectedFile)
}

function kickOff(fileContent: string) {
  const shape = prompt('What are the dimensions of the patrol space? format: w,h')
  if (shape === null) throw new Error('gotta tell me the patrol area size bub')
  if (scale === null) throw new Error('scale element must exist')
  solution = new Day14(fileContent, ['100', shape])
  canvas.width = solution.patrolArea[0] * Number(scale.value)
  canvas.height = solution.patrolArea[1] * Number(scale.value)
  findNextSymPos()
}

const inputelement = <HTMLInputElement>document.getElementById('input')
inputelement.addEventListener('change', resolveNext)

function updateScreen(positions: Array<Array<number>>) {
  if (title === null) throw new Error('need title')
  if (ctx === null) throw new Error('somehow context is null')
  const s = Number(scale.value)
  canvas.width = solution.patrolArea[0] * Number(scale.value)
  canvas.height = solution.patrolArea[1] * Number(scale.value)
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  title.innerHTML = `Timestep: ${counter}`
  positions.forEach((pos) => {
    ctx.fillRect(pos[0] * s, pos[1] * s, s, s)
  })
}

function findNextSymPos() {
  let timeToDraw: boolean = false
  let newPositions: Array<Array<number>> = []
  while (!timeToDraw) {
    counter += interval
    const {isSymmetrical, positions } = solution.part_2(counter)
    newPositions = positions
    timeToDraw ||= isSymmetrical
  }
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