import { Request, Response } from "express"
import { User } from "../models/user.entity.js";

const userController = {
    getAllUsers: async function (req: Request, res: Response) {
        try {
            const users = await User.find({}).exec()
            const modifiedUsers = users.map(user => {
                const {_id, password, ...userObj} = user.toObject()
                console.log(userObj)
                return ({_id: _id.toString(), ...userObj})
            });
            res.status(200).json(modifiedUsers)
        } catch (error) {
            res.status(500).json({message: error})
        }
    },

    getUserById: async function (req: Request, res: Response) {
        try {
            const user = await User.findById(req.params.id).exec()
            if(user) {
                const {_id, ...userObj} = user!.toObject()
                res.status(200).json({_id: _id.toString(), ...userObj})
            } else {
                res.status(404).json({message: "User not found"})
            }
        } catch (error) {
            res.status(500).json({message: error})
        }
    },

    updateUserById: async function (req: Request, res: Response) {
        try {
            const userToUpdate = await User.findById(req.params.id).exec()
            const userUpdater = await User.findById(req.user!._id).exec()
            if(userToUpdate) {
                if(userUpdater?.role !== UserEntity.Role.ADMIN && userToUpdate?.id !== userUpdater?.id) {
                    res.status(403).json({message: "Forbidden"})
                } else {
                    try {
                        const newUser = req.body
                        await User.updateOne({_id: userToUpdate?._id}, newUser)
                        res.status(200).json({ message: "Succesfully Updated" }); 
                    } catch (error) {
                        throw error
                    }
                }
            } else {
                res.status(404).json({message: "User not found"})
            }
        } catch (error) {
            res.status(500).json({message: error})
        }

    },

    deleteUserById: async function (req: Request, res: Response) {
        try {
            const userToDelete = await User.findById(req.params.id).exec()
            const userDeleter = await User.findById(req.user!._id).exec()
            if(userToDelete) {
                if(userDeleter?.role !== UserEntity.Role.ADMIN && userToDelete?.id !== userDeleter?.id) {
                    res.status(403).json({message: "Forbidden"})
                } else {
                    try {
                        const newUser = req.body
                        await User.updateOne({_id: userToDelete?._id}, newUser)
                        res.status(200).json({ message: "Succesfully Deleted" }); 
                    } catch (error) {
                        throw error
                    }
                }
            } else {
                res.status(404).json({message: "User not found"})
            }
        } catch (error) {
            res.status(500).json({message: error})
        }
    }
}

export default userController