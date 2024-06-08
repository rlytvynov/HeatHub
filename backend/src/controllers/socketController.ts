import { Socket } from "socket.io"
import { User } from "../models/user.entity.js"
import Room from "../models/room.entity.js"
import { io } from "../index.js"


const socketController = {
    sendMessageToRoom: async (socket: Socket, message: RoomEntity.Message, callback: (status: {ok: boolean, error: string | null}) => void) => {

    },

    createRoom: async (message: RoomEntity.Message, callback: (status: {ok: boolean, roomID: string, error: string | null}) => void) => {
        try {
            const admins = await User.find({role: "ADMIN"}, "role").exec()
            const adminsId = admins.map(admin => {
                return admin.id
            })
            const room = new Room({
                ownerID: message.senderID,
                messages: [],
                readByUser: true,
                readByAdmin: false
            })
            message.roomID = room.id
            room.messages.push(message)
            room.save()
            const {_id, ...roomObject} = room.toObject()
            for (let index = 0; index < adminsId.length; index++) {
                const sockets = await io.in(`user:${adminsId[index]}`).fetchSockets();
                const isUserConnected = sockets.length > 0;
                console.log(sockets)
                if(isUserConnected) {
                    console.log(adminsId[index])
                    io.to(`user:${adminsId[index]}`).emit("room-created", {_id: room.id, ...roomObject})
                }
            }
            callback({ok: true, roomID: room.id, error: null})
        } catch (error) {
            callback({ok: false, roomID: "", error: error as string})
        }
    },

    readMessageInRoom: (socket: Socket, roomId: string, callback: (status: {ok: boolean, error: string | null}) => void) => {

    }

}

export default socketController