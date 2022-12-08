import Hyperswarm from 'hyperswarm'
import crypto from 'crypto'

const swarm = new Hyperswarm()

swarm.on('connection', function (socket) {
    console.log('New connnection from', socket.remotePublicKey.toString('hex'))
    
    // socket.write('Hello world!')

    // socket.on('data', function (data) {
    //     console.log('Remote peer said:', data.toString())
    // })

    // socket.on('error', function (err) {
    //     console.log('Remote peer errored:', err)
    // })

    // socket.on('close', function () {
    //     console.log('Remote peer fully left')
    // })

    process.stdin.pipe(socket).pipe(process.stdout)
})

const topic = crypto.createHash('sha256').update('play hypercore topic').digest()
swarm.join(topic)
