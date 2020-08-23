const path = require('path')
const http = require('http')  // FOR SOCKET.IO
const express = require('express')
const socketio = require('socket.io')

const app = express()
const server = http.createServer(app)  // FOR SOCKET.IO
const io = socketio(server)  // it servers a files that the clients can use --> "/socket.io/socket.io.js"

const port = process.env.PORT || 3000
const publicDirectoryPath = path.join(__dirname, '../public')

app.use(express.static(publicDirectoryPath));

let count = 0

io.on('connection', (socket) => {  //socket is an object that contains info about the new connections
    console.log("New websocket connection")

    socket.emit('countUpdated', count)


    socket.on('increment', () => {
        count++
        //socket.emit('countUpdated', count)
        io.emit('countUpdated', count)
    })

})

server.listen(port, () => {
    console.log('Server is upp on port ' + port)
});
