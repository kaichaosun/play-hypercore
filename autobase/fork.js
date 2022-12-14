import Corestore from 'corestore'
import Autobase from 'autobase'
import ram from 'random-access-memory'

// Create two chat users, each with their own Hypercores.
// Here since we'll be rerunning the same code a lot, we'll use the ram storage

const store = new Corestore(ram)
const userA = store.get({ name: 'userA' })
const userB = store.get({ name: 'userB' })

// Make an Autobase with those two users as inputs.

const baseA = new Autobase({ inputs: [userA, userB], localInput: userA })
const baseB = new Autobase({ inputs: [userA, userB], localInput: userB })

await baseA.append('A 0 hello! anybody home?', []) // An empty array as a second argument means "empty clock"
await baseB.append('B 0 hello! first one here.', [])
await baseA.append('A 1 hmmm. guess not.', [])
await baseB.append('B 1 anybody home?', [])

await baseA.append('A 2 new message.', [])
await baseA.append('A 3 new message.', [])
await baseA.append('A 4 new message.', [])

await baseB.append('B 2 message', [])
await baseB.append('B 3 message', [])
await baseB.append('B 4 message', [])
await baseB.append('B 5 message', [])
await baseB.append('B 6 message', [])

await baseB.append('B 7 looks like we\'re both online!')

await baseA.append('A 5 oops. gone again', [])
await baseB.append('B 8 hello?', [])

for await (const node of baseA.createCausalStream()) {
    console.log(node.value.toString())
}
