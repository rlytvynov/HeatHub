import http from "node:http"
import express from 'express'
import mongoose from 'mongoose'
import AdminJS from 'adminjs'
import AdminJSExpress from '@adminjs/express'
import * as AdminJSMongoose from '@adminjs/mongoose'
import bodyParser from "body-parser"
import 'dotenv/config'
import morgan from "morgan"
import { User } from './models/user.entity.js'
import bcrypt from "bcrypt"
import cors from "cors"
import { Server } from "socket.io";
import { authSocketMiddleware } from "./middlewares/authSocketMiddleware.js"
import authRouter from "./routes/authRouter.js"
import chatRouter from "./routes/chatRouter.js"
import userRouter from "./routes/userRouter.js"
import socketController from "./controllers/socketController.js"
import { iuser, iuserExtend, role } from "user-frontend"
import { iroom, message } from "room-frontend"
import itemRouter from "./routes/itemRouter.js"
import Tubular from "./models/tubular.entity.js"
import Bps from "./models/bps.entity.js"
import cartRouter from "./routes/cartRouter.js"
import nodemailer from "nodemailer"
import orderRouter from "./routes/orderRouter.js"

// const HTTPS_PORT = process.env.HTTPS_PORT || 8080
const HTTP_PORT = process.env.HTTP_PORT || 8000
const DB_URL = process.env.DB_URL || "test"
declare global {
    namespace Express {
        interface Request {
            user: iuser | iuserExtend
        }
    }
}
AdminJS.registerAdapter({
    Resource: AdminJSMongoose.Resource,
    Database: AdminJSMongoose.Database,
})
const corsOptions = {
    origin: 'http://localhost:3000',
    allowedHeaders: ['Content-Type', 'Authorization'],
    methods: ['GET', 'POST', 'PUT', 'DELETE']
}
const authenticate = async (email: string, password: string) => {
    const user = await User.findOne({email: email}, 'email password role').exec();
    if(!user) {
        return null
    }
    if (user.email === email && await bcrypt.compare(password, user.password) && user.role === "admin" as role) {
        return Promise.resolve(user.toObject())
    } else {
        return null
    }
};
mongoose.connect(DB_URL)
    .then((res) => console.log(`DB connected with ${mongoose.connection.host}`))
    .catch((err) => console.log("DB connection error"))

const server = express()
const admin = new AdminJS({
    resources: [
        {resource: User},
        {resource: Tubular},
        {resource: Bps}
    ],
    locale: { 
        language: 'ru', // default language of application (also fallback)
        availableLanguages: ['en', 'kz', 'ru', 'bg'], 
        localeDetection: true,
        translations: {
            ru: {
                messages: {
                    welcomeOnBoard_title: 'Добро пожаловать, администратор!',
                    invalidCredentials: "Неверные данные"
                },
                components: {
                    "Login": {
                        "welcomeHeader": "Добро пожаловать",
                        "welcomeMessage": "",
                        "properties": {
                            "email": "Электронная почта",
                            "password": "Пароль"
                        },
                        "loginButton": "Войти",
                    },
                }
            }
        },
    },
    rootPath: "/admin"
})
const adminRouter = AdminJSExpress.buildAuthenticatedRouter(
    admin, 
    {
        authenticate: async (email, password) => {
            return await authenticate(email, password);
        },
        cookieName: 'adminjs',
        cookiePassword: 'sessionsecret',
    }, 
    null, 
    {
        resave: false,
        saveUninitialized: true,
        secret: 'sessionsecret',
    },
);
export const adminSessions = new Map<string, string>();
export const userSessions = new Map<string, string>();
server.use(admin.options.rootPath, adminRouter)
// server.use(morgan("dev"));
server.use(cors(corsOptions));
server.use(bodyParser.urlencoded({ extended: true }));
server.use(bodyParser.json())
server.use('/api/auth', authRouter)
server.use('/api/users', userRouter)
server.use('/api/chat', chatRouter)
server.use('/api/items', itemRouter)
server.use('/api/cart', cartRouter)
server.use('/api/order', orderRouter)
server.get('/api/online', async (req: express.Request, res: express.Response) => {
    let users: string[] = []
    if(req.query.type === 'users') {
        for(const [key, value] of userSessions) {
            users.push(key)
        }
        return res.status(200).json({users})
    } else {
        for(const [key, value] of adminSessions) {
            users.push(key)
        }
        return res.status(200).json({admins: users})
    }
})
server.post('/api/call', async (req: express.Request, res: express.Response) => {
    const name = req.body.name ? req.body.name : "Не указано"
    const phone = req.body.phone ? req.body.phone : "Не указано"
    const email = req.body.email
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.ADMIN_EMAIL_LOGIN,
            pass: process.env.ADMIN_EMAIL_PASSWORD,
        },
    });

    const mailOptions = {
        from: `"${name ? name : 'Без имени'}" <${email}>`,
        to: `rlitvinov2003@gmail.com`,
        subject: "HeatHub: Обратная связь",
        html: `<b>Имя: ${name}</b><br/><b>Телефон: ${phone}</b><br/><b>Почта: ${email}</b><br/>`,
    };
  
    try {
      await transporter.sendMail(mailOptions);
      res.status(200).json({ message: 'Request was send'});
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: 'Error sending email', error: error });
    }
})

server.post('/api/call-order', async (req: express.Request, res: express.Response) => {
    const name = req.body.name ? req.body.name : "Не указано"
    const phone = req.body.phone ? req.body.phone : "Не указано"
    const email = req.body.email
    const item = req.body.item

    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.ADMIN_EMAIL_LOGIN,
            pass: process.env.ADMIN_EMAIL_PASSWORD,
        },
    });
    
    const mailOptions = {
        from: `"${name ? name : 'Без имени'}" <${email}>`,
        to: `rlitvinov2003@gmail.com`,
        subject: "HeatHub: Новый заказ",
        html: 
            `<b>Имя: ${name}</b><br/><b>Телефон: ${phone}</b><br/><b>Почта: ${email}</b><br/>`
            +
            `<div>
                <p>${item.name}</p>
                <p>${item.model}</p>
                <p>${item.price}</p>
                <p>${item.amount}</p>
            </div>`
    };
  
    try {
      await transporter.sendMail(mailOptions);
      res.status(200).json({ message: 'Request was send'});
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: 'Error sending email', error: error });
    }
})

const httpServer = http.createServer(server).listen(HTTP_PORT, () => {
    console.log(`HTTPS server is listening at http://localhost:${HTTP_PORT} 🚀`)
    console.log(`Admin Panel started on http://localhost:${HTTP_PORT}${admin.options.rootPath}`)
});

export const io = new Server(httpServer, { 
    cors: corsOptions
});
io.use(authSocketMiddleware);
io.on("connection", (socket) => {
    console.log('User connected:', socket.user.id)
    for(const [key, value] of userSessions) {
        socket.to(value).emit('user-connected', socket.user)
    }
    for(const [key, value] of adminSessions) {
        socket.to(value).emit('user-connected', socket.user)
    }
    socket.user.role === 'admin' ? 
        adminSessions.set(socket.user.id, socket.id)
        :
        userSessions.set(socket.user.id, socket.id)

    socket.on('join-room', (roomID: string, user: iuser) => {
        try {
            socket.join(roomID)
        } catch (error: any) {
            console.log(error.message)
        }
    })
    socket.on('send-message', (message: message, callback: (room:iroom ) => void) => {
        socketController.sendMessageToRoom(socket, message, callback)
    })
    socket.on('leave-room', (roomID: string, user: iuser) => {
        try {
            socket.leave(roomID)
        } catch (error) {
            console.error(`Error occured: ${error}`)
        }
    })
    socket.on('disconnect', () => {
        console.log('User disconnected:', socket.user.id);
        socket.user.role === 'admin' ? 
            adminSessions.delete(socket.user.id)
            :
            userSessions.delete(socket.user.id)
        for(const [key, value] of userSessions) {
            socket.to(value).emit('user-disconnected', socket.user)
        }
        for(const [key, value] of adminSessions) {
            socket.to(value).emit('user-disconnected', socket.user)
        }
    });
});
