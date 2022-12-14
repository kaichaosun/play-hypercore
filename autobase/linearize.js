import Corestore from 'corestore'
import Autobase from 'autobase'
import ram from 'random-access-memory'

// Create two chat users, each with their own Hypercores.
// Here since we'll be rerunning the same code a lot, we'll use the ram storage

const store = new Corestore(ram)
const userA = store.get({ name: 'userA' })
const userB = store.get({ name: 'userB' })

// Make an Autobase with those two users as inputs.
const viewCoreA = store.get({ name: 'view-core' })
const baseA = new Autobase({
    inputs: [userA, userB],
    localInput: userA,
    autostart: true,
    localOutput: viewCoreA,
})
const baseB = new Autobase({ inputs: [userA, userB], localInput: userB })
const view = baseA.view

await baseB.append('B 0 hi! good to hear from you')
await baseA.append('A 0 hi')
await view.update()

console.log('status', view.status)
console.log('length', view.length)

for (let i = 0; i < view.length; i++) {
    const node = await view.get(i)
    console.log(node.value.toString())
}

await baseB.append('B 1 hi! good to hear from you')
await baseA.append('A 1 hi')
await view.update()

console.log('status', view.status)
console.log('length', view.length)

for (let i = 0; i < view.length; i++) {
    const node = await view.get(i)
    console.log(node.value.toString())
}


// const viewCore = store.get({ name: 'view-core' })
// const base = new Autobase({
//     inputs: [userA, userB],
//     localInput: userA,
//     autostart: true,
//     localOutput: viewCore,
// })
// await base.view.update()
// console.log(base.view.length)

// await base.append('hello')
// await base.append('world')

// await base.view.update()
// console.log(base.view.length)

// let block0 = await base.view.get(5)
// console.log(block0.value.toString())