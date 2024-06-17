import { Socket } from "socket.io"
import { User } from "../models/user.entity.js"
import Room from "../models/room.entity.js"
import {adminSessions} from "../index.js"


const socketController = {
    sendMessageToRoom: async (socket: Socket, message: models.client.RoomEntity.Message, callback: (status: {ok: boolean, error: string | null}) => void) => {
        try {
            const room = await Room.findById(message.roomID).exec()
            let sender = null;
            try {
                sender = await User.findById(message.senderID)
            } catch (error) {
                
            }
            if(!room) {
                throw new Error("Room not found")
            }
            room.messages.push(message as models.server.RoomEntity.Message)
            await room.save()

            if(!sender || sender.role === models.server.UserEntity.Role.CUSTOMER) {
                for(const [key, value] of adminSessions) {
                    socket.to(value).emit(`new-message-in-room${room.id}`, message)
                }
            }
            socket.broadcast.to(room.id).emit(`new-message-${room.id}`, message)
            callback({ok: true, error: null})
        } catch(error) {
            console.log(error)
            callback({ok: false, error: error as string})
        }
    },

    createRoom: async (socket: Socket, message: models.client.RoomEntity.Message, callback: (status: {ok: boolean, roomID: string, error: string | null}) => void) => {
        try {
            const room = new Room({
                ownerID: message.senderID,
                messages: [],
                readByUser: true,
                readByAdmin: false
            })
            message.roomID = room.id
            room.messages.push(message as models.server.RoomEntity.Message)
            await room.save()
            const {_id, ...roomObject} = room.toObject()
            for(const [key, value] of adminSessions) {
                socket.to(value).emit("room-created", {id: room.id, ...roomObject})
            }
            callback({ok: true, roomID: room.id, error: null})
        } catch (error) {
            console.log(error)
            callback({ok: false, roomID: "", error: error as string})
        }
    },

    readMessageInRoom: (roomId: string, callback: (status: {ok: boolean, error: string | null}) => void) => {

    }

}

export default socketController