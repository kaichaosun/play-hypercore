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

await baseA.append('A0: hello!')
await baseB.append('B0: hi! good to hear from you')
await baseA.append('A1: likewise. fun exercise huh?')
await baseB.append('B1: yep. great time.')

// Let's print all messages in causal order
for await (const node of baseA.createCausalStream()) {
    console.log(node.value.toString())
}

for await (const node of baseA.createCausalStream()) {
    console.log(node.clock)
}

for await (const node of baseB.createCausalStream()) {
    console.log(node.value.toString())
}