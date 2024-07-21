import { Request, Response } from "express"
import Cart from "../models/cart.entity.js"

const cartController = {
    getItems: async function(req: Request, res: Response) {
        try {
            let cart = await Cart.findOne({holderId: req.user.id}).exec()
            if(!cart) {
                await Cart.create({holderId: req.user.id})
                return res.status(200).json([])
            } else {
                return res.status(200).json(cart.items)
            }

        } catch (error) {
            res.status(500).json({message: 'Internal Server Error'})
        }
    },
    updateCart: async function (req: Request, res: Response) {
        try {
            const cart = await Cart.findOne({holderId: req.user.id}).exec()
            if(!cart) {
                return res.status(404).json({message: 'Not Found'})
            }
            if(Array.isArray(req.body)) {
                cart.items = req.body
            } else {
                cart.items = [...cart.items, req.body]
            }
            await cart.save()
            return res.status(200).json({message: 'ok'})
        } catch (error: any) {
            console.log(error.message)
            res.status(500).json({message: 'Internal Server Error'})
        }
    },

    clearCart: async function (req: Request, res: Response) {
        try {
            await Cart.deleteOne({holderId: req.user.id}).exec()
            return res.status(200).json({message: 'ok'})
        } catch (error: any) {
            console.log(error.message)
            res.status(500).json({message: 'Internal Server Error'})
        }
    }
}

export default cartController