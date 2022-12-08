import DHT from '@hyperswarm/dht'

const node = new DHT()

const server = node.createServer()

server.on('connection', function (socket) {
    console.log('New connection from', socket.remotePublicKey.toString('hex'))
    console.log('Local public key', socket.publicKey.toString('hex'))
    
    // socket.write('Hello world')
    // socket.end()

    process.stdin.pipe(socket).pipe(process.stdout)
})

const keyPair = DHT.keyPair()
await server.listen(keyPair)

console.log('Connect to:')
console.log(keyPair.publicKey.toString('hex'))
