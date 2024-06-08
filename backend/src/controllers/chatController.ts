import { Request, Response } from "express";
import Room from "../models/room.entity.js";

const chatController = {
    getRooms: async function(req: Request, res: Response) {
        try {
            const rooms = await Room.find({}).exec()
            const modifiedRooms = rooms.map(room => {
                const {_id, ...roomObj} = room.toObject()
                return ({_id: _id.toString(), ...roomObj})
            });
            res.status(200).json(modifiedRooms)
        } catch (error) {
            res.status(500).json({message: error})
        }

    },

    getMyRoom: async function (req: Request, res: Response) {
        try {
            const room = await Room.findOne({ownerID: req.user!._id}).exec()
            if(room) {
                const {_id, ...roomObj} = room.toObject()
                res.status(200).json(roomObj)
            } else {
                res.status(404).json({message: "Room is not found"})
            }
        } catch (error) {
            res.status(500).json({message: error})
        }
    },

    getRoomById: async function (req: Request, res: Response) {
        try {
            const room = await Room.findById(req.params.roomId).exec()
            if(room) {
                const {_id, ...roomObj} = room.toObject()
                res.status(200).json({_id: room.id, ...roomObj})
            } else {
                res.status(404).json({message: "Room is not found"})
            }
        } catch (error) {
            res.status(500).json({message: error})
        }
    }
}

export default chatController
