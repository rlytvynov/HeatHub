import https from "node:https"
import http from "node:http"
import fs from "node:fs"
import express from 'express'
import mongoose from 'mongoose'
import AdminJS from 'adminjs'
import AdminJSExpress from '@adminjs/express'
import * as AdminJSMongoose from '@adminjs/mongoose'
import 'dotenv/config'
import morgan from "morgan"
import { User } from './models/user.entity.js'
import bcrypt from "bcrypt"
import cors from "cors"
import { Server, Socket } from "socket.io";
import { authSocketMiddleware } from "./middlewares/authSocketMiddleware.js"
import authRouter from "./routes/authRouter.js"
import chatRouter from "./routes/chatRouter.js"
import socketController from "./controllers/socketController.js"

const HTTPS_PORT = process.env.HTTPS_PORT || 8080
const HTTP_PORT = process.env.HTTP_PORT || 8000
const DB_URL = process.env.DB_URL || "test"
AdminJS.registerAdapter({
    Resource: AdminJSMongoose.Resource,
    Database: AdminJSMongoose.Database,
})
const authenticate = async (email: string, password: string) => {
    const user = await User.findOne({email: email}, 'email password role').exec();
    if(!user) {
        return null
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (user.email === email && await bcrypt.compare(password, user.password) && user.role === UserEntity.Role.ADMIN) {
        return Promise.resolve(user.toObject())
    } else {
        return null
    }
};
export const usersSocketMap = new Map<string, Socket>();
mongoose.connect(DB_URL)
    .then((res) => console.log(`DB connected with ${mongoose.connection.host}`))
    .catch((err) => console.log("DB connection error"))

const server = express()
const admin = new AdminJS({
    resources: [
        {resource: User},
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
server.use(admin.options.rootPath, adminRouter)
// server.use(morgan("dev"));
server.use(cors({
    origin: 'http://localhost:3000',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));
server.use(express.json())
server.use(express.urlencoded({extended: true}))
server.use('/api/auth', authRouter)
server.use('/api/chat', chatRouter)

http.createServer((req, res) => {
    console.log(`https://${req.headers.host}${req.url}`)
    res.writeHead(301, { Location: `https://${req.headers.host}${req.url}` });
    res.end();
}).listen(HTTP_PORT, () => {
    console.log(`HTTP server started on http://localhost:${HTTP_PORT}`)
});  

const httpsServer = https.createServer({ key: fs.readFileSync("key.pem"), cert: fs.readFileSync("cert.pem"), }, server)
export const io = new Server(httpsServer, { 
    cors: {
        origin: 'http://localhost:3000',
        credentials: true,
        methods: ['GET', 'POST', 'PUT', 'DELETE'],
        allowedHeaders: ['Content-Type', 'Authorization']
    }
});

io.engine.use(authSocketMiddleware);
io.on("connection", (socket) => {
    const user = (socket.request as express.Request).user
    const userId = user ? user._id.toString() : socket.id
    usersSocketMap.set(userId, socket)
    console.log('User connected:', userId)
    socket.join(`user:${userId}`);

    const connectedSockets = Array.from(io.sockets.sockets.keys());
    console.log(connectedSockets)

    socket.on('create-room-try', (message: RoomEntity.Message, callback: (status: {ok: boolean, roomID: string, error: string | null}) => void) => {
        socketController.createRoom(message, callback)
    })

    // socket.on("join-room", (room: RoomEntity.IRoom) => {
    //     socket.join(room._id.toString())
    //     console.log(`${userId} joined to room: ${room._id.toString()}`)
    //     socket.to(room._id.toString()).emit("joined", user ? user._id : null)

    //     socket.on("message-send-try", (message: RoomEntity.Message, callback: (status: {ok: boolean, error: string | null}) => void) => {
    //         socketController.sendMessageToRoom(socket, message, callback)
    //     })

    //     socket.on("message-read-try", (callback: (status: {ok: boolean, error: string | null}) => void) => {
    //         socketController.readMessageInRoom(socket, room._id.toString(), callback)
    //     })
    // })

    // socket.on('leave-room', (room: RoomEntity.IRoom) => {
    //     socket.leave(room._id.toString())
    // })

    socket.on('disconnect', () => {
        console.log('User disconnected:', userId);
        usersSocketMap.delete(userId);
        // usersSocketMap.forEach((socket, userId) => {
        //     console.log(`User ID: ${userId}`);
        // });
    });
});

httpsServer.listen(HTTPS_PORT, () => {
    console.log(`HTTPS server is listening at https://localhost:${HTTPS_PORT} 🚀`)
    console.log(`Admin Panel started on https://localhost:${HTTPS_PORT}${admin.options.rootPath}`)
});
