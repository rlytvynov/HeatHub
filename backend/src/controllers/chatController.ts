import { Request, Response } from "express";
import Room from "../models/room.entity.js";

const chatController = {
    getRooms: async function(req: Request, res: Response) {
        try {
            if(req.user.role === models.client.UserEntity.Role.ADMIN) {
                const rooms = await Room.find({}).exec()
                const modifiedRooms = rooms.map(room => {
                    const {_id, ...roomObj} = room.toObject()
                    return ({id: _id.toString(), ...roomObj})
                });
                res.status(200).json(modifiedRooms)
            } else {
                res.status(403).json({message: "Forbidden"})
            }
        } catch (error) {
            console.log(error)
            res.status(500).json({ message: "Intenal server error while getRooms" })
        }

    },

    getMyRoom: async function (req: Request, res: Response) {
        try {
            const room = await Room.findOne({ownerID: req.user.id}).exec()
            if(room) {
                const {_id, ...roomObj} = room.toObject()
                res.status(200).json({id: _id.toString(), ...roomObj})
            } else {
                res.status(404).json({message: "Room is not found"})
            }
        } catch (error) {
            console.log(error)
            res.status(500).json({ message: "Intenal server error while getMyRoom" })
        }
    },

    getRoomById: async function (req: Request, res: Response) {
        try {
            const room = await Room.findById(req.params.roomId).exec()
            if(room) {
                const {_id, ...roomObj} = room.toObject()
                res.status(200).json({id: room.id, ...roomObj})
            } else {
                res.status(404).json({message: "Room is not found"})
            }
        } catch (error) {
            console.log(error)
            res.status(500).json({ message: "Intenal server error while getRoomById" })
        }
    }
}

export default chatController
