import { SolutionBase } from '@utilities/solutionFormat'

class Chunk {
  id: number
  blocks: number
  constructor(id: number, blocks: number){
    this.id = id
    this.blocks = blocks
  }

  split(blockReduction: number) {
    if (blockReduction > this.blocks) throw new Error('Attempting to remove more blocks than there are in the chunk')
    this.blocks = this.blocks - blockReduction
    return new Chunk(this.id, blockReduction)
  }
}

export default class Day9 extends SolutionBase {
  constructor(filePath: string) {
    super(`${__dirname}/${filePath}`)
  }

  // sum all values between n and k; k is 0 if not provided
  triangleSum(n: number, k: number = 0) {
    return (n * (n+1) / 2) - (k * (k+1) / 2)
  }

  part_1(): number {
    const diskMap: Array<number> = []
    this.parseInput((line) => {
      diskMap.push(...line.split('').map(Number))
    })
    let i = 0
    let j = diskMap.length - 1
    let checksum = 0
    let blockIndex = -1
    while (i <= j) {
      if(i % 2 === 0) {
        checksum += this.triangleSum(diskMap[i] + blockIndex, blockIndex) * Math.floor(i / 2)
        blockIndex += diskMap[i]
        i++
      } else {
        if (diskMap[i] > diskMap[j]) {
          diskMap[i] = diskMap[i] - diskMap[j]
          checksum += Math.floor(j / 2) * this.triangleSum(diskMap[j] + blockIndex, blockIndex)
          blockIndex += diskMap[j]
          diskMap[j] = 0
        } else {
          diskMap[j] = diskMap[j] - diskMap[i]
          checksum += (j / 2) * this.triangleSum(diskMap[i] + blockIndex, blockIndex)
          blockIndex += diskMap[i] 
          diskMap[i] = 0
        }
      }
      if (diskMap[i] === 0) i++
      if (diskMap[j] === 0) j -= 2
    }
    return checksum
  }

  part_2(): number {
    const diskMap: Array<Chunk> = []
    this.parseInput((line) => {
      line.split('').forEach((element, index) => {
        const id = index % 2 === 0 ? index / 2 : -1
        diskMap.push( new Chunk(id, Number(element)) )
      })
    })
    
    // reorder the diskmap
    let j = diskMap.length - 1
    while (j > 0) {
      if (diskMap[j].id !== -1) {
        for(let i = 0; i < j; i++) {
          if (diskMap[i].id === -1 && diskMap[i].blocks >= diskMap[j].blocks){
            // contains diskMap[j].blocks number of empty blocks
            const emptyReplacement = diskMap[i].split(diskMap[j].blocks)
            const temp = diskMap[j]
            diskMap[j] = emptyReplacement
            const chunksToReplace = diskMap[i].blocks === 0 ? 1 : 0
            diskMap.splice(i,chunksToReplace,temp)
            break
          }
        }
      }
      j--
    }

    let blockIndex = -1
    let checksum = 0
    diskMap.forEach((chunk) => {
      if (chunk.id >= 0)
      checksum += chunk.id * this.triangleSum(chunk.blocks + blockIndex, blockIndex)
      blockIndex += chunk.blocks
    })
    return checksum
  }
}