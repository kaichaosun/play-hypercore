import Corestore from 'corestore'
import Autobase from 'autobase'
import ram from 'random-access-memory'
import chalk from 'chalk'

// Create two chat users, each with their own Hypercores.
// Here since we'll be rerunning the same code a lot, we'll use the ram storage

console.log(chalk.green('\n(1) The Simplest Possible Index\n'))
{
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
}

console.log(chalk.green('\n(2) The Simplest Index, but with Forks\n'))
{
    // Create two chat users, each with their own Hypercores.
    const store = new Corestore(ram)
    const userA = store.get({ name: 'userA' })
    const userB = store.get({ name: 'userB' })
    const viewCore = store.get({ name: 'view-core' })

    // Make two Autobases with those two users as inputs.
    const baseA = new Autobase({
        inputs: [userA, userB],
        localInput: userA,
        autostart: true,
        localOutput: viewCore
    })
    const baseB = new Autobase({
        inputs: [userA, userB],
        localInput: userB
    })

    // We can use either Autobase to create the index, so well just pick baseA
    const view = baseA.view;

    // Append chat messages and read them out again, manually specifying empty clocks.
    // This simulates two peers creating independent forks.
    await baseA.append('A0: hello! anybody home?', []) // An empty array as a second argument means "empty clock"
    await baseB.append('B0: hello! first one here.', [])
    await baseA.append('A1: hmmm. guess not.', [])
    await baseB.append('B1: anybody home?', [])

    await view.update()
    console.log(chalk.yellow('Index status after the first two independent messages:'), view.status)

    // Add 3 more independent messages to A.
    for (let i = 0; i < 3; i++) {
        await baseA.append(`A${2 + i}: trying again...`, [])
    }

    await view.update()
    console.log(chalk.yellow('Index status after A appends 3 more messages:'), view.status)

    // Add 5 more independent messages to B. Does its fork move to the beginning or the end?
    for (let i = 0; i < 5; i++) {
        await baseB.append(`B${2 + i}: also trying again...`, [])
    }

    await view.update()
    console.log(chalk.yellow('Index status after B appends 5 more messages:'), view.status)
}

// (3) A Mapping Indexer
console.log(chalk.green('\n(3) A Mapping Indexer\n'))
{
    // Create two chat users, each with their own Hypercores.
    const store = new Corestore(ram)
    const userA = store.get({ name: 'userA' })
    const userB = store.get({ name: 'userB' })
    const viewCore = store.get({ name: 'view-core' })

    // Make two Autobases with those two users as inputs.
    const baseA = new Autobase({
        inputs: [userA, userB],
        localInput: userA,
        autostart: true,
        localOutput: viewCore,
        apply: async (batch) => {
            // batch = batch.map(({ value }) => Buffer.from(value.toString().toUpperCase()))
            // await view.append(batch)

            let count = 0

            // First, we need to get the latest count from the last node in the view.
            if (view.length > 0) {
                const lastNode = await view.get(view.length - 1)
                const lastRecord = JSON.parse(lastNode.value.toString())
                count = lastRecord.count
            }

            // Next, we can record a stringified record that includes both the message and the count for every node in the batch.
            batch = batch.map(({ value }, idx) => {
                const record = JSON.stringify({
                    message: value.toString(),
                    count: count + idx + 1
                })
                return Buffer.from(record)
            })

            // Finally, append it just like before.
            await view.append(batch)
        }
    })
    const baseB = new Autobase({
        inputs: [userA, userB],
        localInput: userB
    })

    // Append chat messages and read them out again, using the default options.
    // This simulates two peers who are always completely up-to-date with each others messages.
    await baseA.append('A0: hello!')
    await baseB.append('B0: hi! good to hear from you')
    await baseA.append('A1: likewise. fun exercise huh?')
    await baseB.append('B1: yep. great time.')

    const view = baseA.view;
    await view.update()

    // All the indexed nodes will be uppercased now.
    for (let i = 0; i < view.length; i++) {
        const node = await view.get(i)
        console.log(node.value.toString())
    }
}

// (4) Sharing Indexes with Others
// TODO this is broken
console.log(chalk.green('\n(4) Sharing Indexes with Others\n'))
{
    // Create two chat users, each with their own Hypercores.
    const store = new Corestore(ram)
    const userA = store.get({ name: 'userA' })
    const userB = store.get({ name: 'userB' })
    const viewCore = store.get({ name: 'view-core' })

    // Make two Autobases with those two users as inputs.
    const baseA = new Autobase({
        inputs: [userA, userB],
        localInput: userA,
        autostart: true,
        localOutput: viewCore
    })
    const baseB = new Autobase({
        inputs: [userA, userB],
        localInput: userB
    })

    // Append chat messages and read them out again, using the default options.
    // This simulates two peers who are always completely up-to-date with each others messages.
    await baseA.append('A0: hello!')
    await baseB.append('B0: hi! good to hear from you')
    await baseA.append('A1: likewise. fun exercise huh?')
    await baseB.append('B1: yep. great time.')

    const view = baseA.view
    await view.update()

    for (let i = 0; i < view.length; i++) {
        const node = await view.get(i)
        console.log(node.value.toString())
    }

    // Now we will simulate a "reader" who will use the index above as a remote index.
    // The reader will not be participating in the chat, but will be reading from the index.
    const readerView = store.get({ name: 'reader-view' })
    const baseC = new Autobase({
        inputs: [userA, userB],
        autostart: true,
        localOutput: readerView,
    })

    // This will piggy-back off of the work `viewCore` has already done.
    await readerView.update()

    // Since the remote index is fully up-to-date, the reader should not have to do any work.
    console.log(chalk.yellow('Reader update status (should be zeros):'), readerView.status, '\n')

    for (let i = 0; i < readerView.length; i++) {
        const node = await readerView.get(i)
        console.log(node.value.toString())
    }
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