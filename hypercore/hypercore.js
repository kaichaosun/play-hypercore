import Hypercore from 'hypercore'

const core = new Hypercore('./data')

const { length, byteLength } = await core.append(Buffer.from("Block 0"))
// console.log(length, byteLength)

// core.clear(0, 20)

console.log(core.length)
const block = await core.get(core.length - 1)  // empty if index is out of range
console.log(block.toString())
