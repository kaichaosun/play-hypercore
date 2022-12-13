import Corestore from 'corestore'

const store = new Corestore('./data')

// You can access cores from the store either by their public key or a local name
const core = store.get({ name: 'my-first-core' })

await core.ready()

await core.append(Buffer.from('a block'))

console.log('Core public key:', core.key.toString('hex'))
console.log('Core has', core.length, 'entries')

const block0 = await core.get(0)
console.log('Block 0:', block0.toString())

const sameCore = store.get(Buffer.from(core.key.toString('hex'), 'hex')) // this is not working
await sameCore.ready()

console.log('Core public key:', sameCore)
console.log('Core from key has', sameCore.length, 'entries')