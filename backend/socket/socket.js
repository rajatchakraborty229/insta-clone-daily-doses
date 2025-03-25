import { Server } from 'socket.io'
import express from 'express'
import http from 'http'

const app = express()
const server = http.createServer(app)

const io = new Server(server, {
    cors: {
        origin: "http://localhost:5173",
        methods: ['GET', 'POST']
    }
})

const userSocketMap = {}; // This is an object to store user-socket mappings

// Corrected this function to properly access the object
export const getReceiverSocketId = (receiverId) => userSocketMap[receiverId]

io.on('connection', (socket) => {
    const userId = socket.handshake.query.userId;
    
    if (userId) {
        // Store the socket ID in the object
        userSocketMap[userId] = socket.id
        console.log(`user connected: UserId=${userId}, SocketId=${socket.id}`)
        
        // Send updated online users list to all clients
        io.emit('getOnlineUsers', Object.keys(userSocketMap))
    }

    socket.on('disconnect', () => {
        if (userId) {
            console.log(`user disconnected: UserId=${userId}, SocketId=${socket.id}`)
            delete userSocketMap[userId]
            io.emit('getOnlineUsers', Object.keys(userSocketMap))
        }
    })
})

export { app, server, io }