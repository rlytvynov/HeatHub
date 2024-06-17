import {Request, Response } from "express";
import { User } from '../models/user.entity.js';
import bcrypt from 'bcrypt';
import jwt from "jsonwebtoken"

const authController = {
    me: async function (req: Request, res: Response) {
        return res.status(200).json(req.user)
    },

    login: async function (req: Request, res: Response) {
        try {
            let candidate = await User.findOne({email: req.body.email}, '-__v').exec()
            if(!candidate) {
                return res.status(401).json({ message: "Invalid email or password" })
            }

            const isMatches = bcrypt.compareSync(req.body.password, candidate.password) 
            if(!isMatches) {
                return res.status(401).json({ message: "Invalid email or password" })
            }

            const {_id, role, ...userObj} = candidate.toObject()
            const token = `Bearer ${jwt.sign({id: _id.toString(), role}, process.env.JWT_SECRET_KEY || "secret", { expiresIn: "24h" })}`;
            res.status(200).json({ token, user: {id: _id.toString(), role}});
        } catch (error) {
            console.log(error)
            res.status(500).json({message: "Intenal server error while login"})
        }

    }, 

    register: async function(req: Request, res: Response) {
        try {
            const user = await User.findOne({email: req.body.email}).exec()
            if(user) {
                return res.status(409).json({message: "User with this email already exists"})
            }
            const passwordHash = await bcrypt.hash(req.body.password, 12)
            await User.create({
                email: req.body.email,
                password: passwordHash,
                fullName: req.body.fullName,
                role: req.body.role
            })
            res.status(201).json({ message: "User registered successfully" });
        } catch (error) {
            console.log(error)
            res.status(500).json({ message: "Intenal server error while register" })
        }
    }

    // logout: async function(req: Request, res: Response) {
    //     try {
    //         const userId = req.user!._id.toString()
    //         const socket = usersSocketMap.get(userId);
    //         if (socket) {
    //             socket.disconnect();
    //             usersSocketMap.delete(userId);
    //         }
    //         res.status(200).json({ message: "Logged out successfully" });
    //     } catch (error) {
    //         console.log(error)
    //         res.status(500).json({message: error})
    //     }
    // }
}

export default authController