import { Socket } from "socket.io"
import Room from "../models/room.entity.js"
import {io, adminSessions, userSessions} from "../index.js"
import { iroom, message, message as messageFrontend } from "room-frontend"
import { message as messageBackend } from "room-server"
import { iuser, role } from "user-frontend"


const socketController = {
    sendMessageToRoom: async (socket: Socket, message: messageFrontend, callback: (room:iroom ) => void ) => {
        try {
            let room
            if(!message.roomID) {
                room = new Room({
                    ownerID: message.senderID,
                    messages: [],
                    readByUser: true,
                    readByAdmin: false
                })
                message.roomID = room.id
            } else {
                try {
                    room = await Room.findById(message.roomID).exec()
                } catch (error) {
                    throw new Error("Something went wrong...")
                }
            }
            room!.messages.push(message as messageBackend)
            await room!.save()
            if(socket.user.role === "customer") {
                room!.readByUser = true
                const sockets = await io.in(room!.id).fetchSockets()
                if(sockets.length < 2) {
                    room!.readByAdmin = false
                    await room!.save()
                    const {_id, ...roomObj} = room!.toObject()
                    for(const [key, value] of adminSessions) {
                        socket.to(value).emit(`new-room-message`, {id: _id.toString(), ...roomObj})
                    }
                    console.log("Admin outside the room")
                    callback({id: _id.toString(), ...roomObj})
                } else {
                    room!.readByAdmin = true
                    await room!.save()
                    const {_id, ...roomObj} = room!.toObject()
                    socket.broadcast.to(room!.id).emit(`new-message`,  {id: _id.toString(), ...roomObj})
                    console.log("Admin in room")
                    callback({id: _id.toString(), ...roomObj})
                }
            } else {
                room!.readByAdmin = true
                const sockets = await io.in(room!.id).fetchSockets()
                if(sockets.length < 2) {
                    room!.readByUser = false
                    await room!.save()
                    const {_id, ...roomObj} = room!.toObject()
                    console.log("User outside the room")
                    for(const [key, value] of userSessions) {
                        if(key === room!.ownerID) {
                            socket.to(value).emit(`new-room-message`,  {id: _id.toString(), ...roomObj})
                        }
                    }
                    callback({id: _id.toString(), ...roomObj})
                } else {
                    room!.readByUser = true
                    await room!.save()
                    const {_id, ...roomObj} = room!.toObject()
                    socket.broadcast.to(room!.id).emit(`new-message`,  {id: _id.toString(), ...roomObj})
                    console.log("User in the room")
                    callback({id: _id.toString(), ...roomObj})
                }
            }
        } catch(error) {
            console.log(error)
        }
    },

    // createRoom: async (socket: Socket, message: message, callback: (status: {ok: boolean, roomID: string, error: string | null}) => void) => {
    //     try {
    //         const room = new Room({
    //             ownerID: message.senderID,
    //             messages: [],
    //             readByUser: true,
    //             readByAdmin: false
    //         })
    //         message.roomID = room.id
    //         room.messages.push(message as messageBackend)
    //         await room.save()
    //         const {_id, ...roomObject} = room.toObject()
    //         for(const [key, value] of adminSessions) {
    //             socket.to(value).emit("room-created", {id: room.id, ...roomObject})
    //         }
    //         callback({ok: true, roomID: room.id, error: null})
    //     } catch (error) {
    //         console.log(error)
    //         callback({ok: false, roomID: "", error: "Error while creating room"})
    //     }
    // },

    readMessageInRoom: async (socket: Socket, roomID: string, user: iuser, callback: (status: {ok: boolean, error: string | null}) => void) => {
        try {
            const room = await Room.findById(roomID).exec()
            if(!room) {
                throw new Error("Room not found")
            }
            user.role === "admin" ? room.readByAdmin = true : room.readByUser = true
            await room.save()
            callback({ok: true, error: null})
        } catch (error) {
            console.log(error)
            callback({ok: false, error: "Error while reading room"})
        }
    }

}

export default socketController