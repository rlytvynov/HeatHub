import {Request, Response } from "express";
import { User } from '../models/user.entity.js';
import bcrypt from 'bcrypt';
import jwt from "jsonwebtoken"
import { usersSocketMap } from "../index.js";

const authController = {
    me: async function (req: Request, res: Response) {
        return res.status(200).json(req.user)
    },

    login: async function (req: Request, res: Response) {
        try {
            let candidate = await User.findOne({email: req.body.email}, '-__v').exec()
            if(!candidate) {
                res.status(401).json({ message: "Invalid email or password" })
            } else {
                const isMatches = bcrypt.compareSync(req.body.password, candidate.password) 
                if(!isMatches) {
                    res.status(401).json({ message: "Invalid email or password" })
                }
                const {_id, password, ...userObj} = candidate.toObject()
                const token = `Bearer ${jwt.sign({_id: _id.toString(), ...userObj}, process.env.JWT_SECRET_KEY || "secret", { expiresIn: "1h" })}`;
                res.status(200).json({ token, user: {_id: _id.toString(), ...userObj}});
            }
        } catch (error) {
            console.log(error)
            res.status(500).json({message: error})
        }

    }, 

    register: async function(req: Request, res: Response) {
        try {
            const user = await User.findOne({email: req.body.email}).exec()
            if(user) {
                res.status(409).json({message: "User with this email already exists"})
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
            res.status(500).json({message: error})
        }
    },

    logout: async function(req: Request, res: Response) {
        try {
            const userId = req.user!._id.toString()
            const socket = usersSocketMap.get(userId);
            if (socket) {
                socket.disconnect();
                usersSocketMap.delete(userId);
            }
            res.status(200).json({ message: "Logged out successfully" });
        } catch (error) {
            console.log(error)
            res.status(500).json({message: error})
        }
    }
}

export default authController