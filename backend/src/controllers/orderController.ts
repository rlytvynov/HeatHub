import { Request, Response } from "express"
import Order from "../models/order.entity.js"
import nodemailer from "nodemailer"
import { User } from "../models/user.entity.js";
import { itemCart } from "cart-frontend";

const authController = {
    getOrders: async function (req: Request, res: Response) {

    },

    createOrder: async function (req: Request, res: Response) {
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.ADMIN_EMAIL_LOGIN,
                pass: process.env.ADMIN_EMAIL_PASSWORD,
            },
        });

        try {
            const items = req.body as itemCart[]
            const user = await User.findById(req.user.id).exec()
            if(!user) {
                return res.status(404).json({message: "User not found"})
            }

            const mailOptions = {
                from: `"${user.fullName}" <${user.email}>`,
                to: `rlitvinov2003@gmail.com`,
                subject: "HeatHub: Новый заказ",
                html: items.map((item) => {
                    return(
                        `<div> 
                            <p>${item.name}</p>
                            <p>${item.model}</p>
                            <p>${item.price}</p>
                            <p>${item.amount}</p>
                        </div>`
                    )
                }).join("\n"),
            };
            await Order.create({
                receiverId: req.user.id,
                status: "processing",
                file: '', 
                items
            })
            await transporter.sendMail(mailOptions);
            return res.status(201).json({message: 'Order creared'})
        } catch (error) {
            return res.status(500).json({message: 'Internal server Error'})
        }
    }
}

export default authController