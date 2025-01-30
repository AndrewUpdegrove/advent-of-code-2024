import { SolutionBase } from '@utilities/solutionFormat'

export default class Day17 extends SolutionBase {
  registerA: bigint = BigInt(-1)
  registerB: bigint = BigInt(-1)
  registerC: bigint = BigInt(-1)
  program: Array<number> = []
  pointer: number = 0
  cout: Array<bigint> = []
  constructor(filePath: string) {
    super(`${__dirname}/${filePath}`)
    this.parseInput((line) => {
      if (line.includes('A')) this.registerA = BigInt(line.slice(12))
      if (line.includes('B')) this.registerB = BigInt(line.slice(12))
      if (line.includes('C')) this.registerC = BigInt(line.slice(12))
      if (line.includes('Program')) this.program = line.slice(9).split(',').map(Number)
    })
  }

  getCombo(combo: number) {
    if (combo < 4) return BigInt(combo)
    else if (combo === 4) return this.registerA
    else if (combo === 5) return this.registerB
    else if (combo === 6) return this.registerC
    else {
      throw new Error('invalid combo operand')
    }
  }

  // opcode 0
  adv(combo: number) {
    this.registerA = this.registerA / BigInt(2) ** this.getCombo(combo)
  }

  // opcode 6
  bdv(combo: number) {
    this.registerB = this.registerA / BigInt(2) ** this.getCombo(combo)
  }

  // opcode 7
  cdv(combo: number) {
    this.registerC = this.registerA / BigInt(2) ** this.getCombo(combo)
  }

  // opcode 1
  bxl(literal: number) {
    this.registerB = this.registerB ^ BigInt(literal)
  }

  // opcode 2
  bst(combo: number) {
    this.registerB = this.getCombo(combo) & BigInt(7)
  }

  // opcode 3
  jnz(literal: number) {
    if (this.registerA !== BigInt(0)) this.pointer = (literal - 2)
  }

  // opcode 4
  bxc() {
    this.registerB = this.registerB ^ this.registerC
  }

  // opcode 5
  out(combo: number) {
    this.cout.push(this.getCombo(combo) & BigInt(7))
  }

  part_1(): Array<bigint> {
    const opcodes = [
      this.adv.bind(this),
      this.bxl.bind(this),
      this.bst.bind(this),
      this.jnz.bind(this),
      this.bxc.bind(this),
      this.out.bind(this),
      this.bdv.bind(this),
      this.cdv.bind(this)
    ]
    while (this.pointer < this.program.length) {
      opcodes[this.program[this.pointer]](this.program[this.pointer+1])
      this.pointer += 2
    }
    return this.cout
  }


  reset_state() {
    this.registerA = BigInt(0)
    this.pointer = 0
    this.cout = []
  }

  part_2(): bigint {

    let startingA = BigInt(0)
    let finalAnswer: bigint = BigInt(0)
    let exitProduct: Array<bigint> = []
    while (exitProduct.length < this.program.length) {
      while((startingA & BigInt(7)) <= 7) {
        this.reset_state()
        this.registerA = startingA
        exitProduct = this.part_1()
        if (this.program.slice(-1 * exitProduct.length).toString() === exitProduct.toString()) {
          finalAnswer = startingA
          startingA = startingA << BigInt(3)
          break
        }
        startingA++
      }
    }
    return finalAnswer
  }
}