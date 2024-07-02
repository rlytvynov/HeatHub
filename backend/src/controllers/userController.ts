import { Request, Response } from "express"
import { User } from "../models/user.entity.js";
import { role } from "user-frontend";

const userController = {
    getAllUsers: async function (req: Request, res: Response) {
        try {
            const users = await User.find({}).exec()
            const modifiedUsers = users.map(user => {
                const {_id, password, ...userObj} = user.toObject()
                return ({id: _id.toString(), ...userObj})
            });
            res.status(200).json(modifiedUsers)
        } catch (error) {
            console.log(error)
            res.status(500).json({message: 'Internal server error while getAllUsers'})
        }
    },

    getUserById: async function (req: Request, res: Response) {
        try {
            if(req.params.id.includes('-')) {
                return res.status(404).json({message: "Anonimous user"})
            }
            const user = await User.findById(req.params.id).exec()
            if(!user) {
                return res.status(404).json({message: "User not found"})
            }
            const {_id, password, role, ...userObj} = user.toObject()
            res.status(200).json({...userObj})
        } catch (error) {
            console.log(error)
            res.status(500).json({message: 'Internal server error while getUserById'})
        }
    },

    updateUserById: async function (req: Request, res: Response) {
        try {
            const userToUpdate = await User.findById(req.params.id).exec()
            const userUpdater = await User.findById(req.user.id).exec()
            if(!userToUpdate) {
                return res.status(404).json({message: "User not found"})
            }
            if(!userUpdater) {
                return res.status(500).json({message: "Something went wrong..."})
            }
            if(userUpdater.role !== "admin" as role && userToUpdate.id !== userUpdater.id) {
                return res.status(403).json({message: "Forbidden"})
            }
            try {
                const newUser = req.body
                await User.findByIdAndUpdate(userToUpdate.id, newUser).exec()
                res.status(200).json({ message: "Succesfully Updated" }); 
            } catch (error) {
                throw error
            }
        } catch (error) {
            console.log(error)
            res.status(500).json({message: 'Internal server error while updateUserById'})
        }

    },

    deleteUserById: async function (req: Request, res: Response) {
        // try {
        //     const userToDelete = await User.findById(req.params.id).exec()
        //     const userDeleter = await User.findById(req.user!._id).exec()
        //     if(userToDelete) {
        //         if(userDeleter?.role !== UserEntity.Role.ADMIN && userToDelete?.id !== userDeleter?.id) {
        //             res.status(403).json({message: "Forbidden"})
        //         } else {
        //             try {
        //                 const newUser = req.body
        //                 await User.updateOne({_id: userToDelete?._id}, newUser)
        //                 res.status(200).json({ message: "Succesfully Deleted" }); 
        //             } catch (error) {
        //                 throw error
        //             }
        //         }
        //     } else {
        //         res.status(404).json({message: "User not found"})
        //     }
        // } catch (error) {
        //     res.status(500).json({message: error})
        // }
    }
}

export default userController