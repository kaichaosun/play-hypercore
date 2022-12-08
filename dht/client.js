import DHT from '@hyperswarm/dht'

const node = new DHT()

const remotePublicKey = Buffer.from('7b2c5e211fab33b8406081ab5e5f3f52bdb75f8c3f562f374a685000d337d170', 'hex')
const socket = node.connect(remotePublicKey)

socket.on('open', function () {
    console.log('Connected to server')
})

// socket.on('data', function (data) {
//     console.log('Remote said:', data.toString())
// })

process.stdin.pipe(socket).pipe(process.stdout)