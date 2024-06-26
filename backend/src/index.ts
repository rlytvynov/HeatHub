import http from "node:http"
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
import { Server } from "socket.io";
import { authSocketMiddleware } from "./middlewares/authSocketMiddleware.js"
import authRouter from "./routes/authRouter.js"
import chatRouter from "./routes/chatRouter.js"
import userRouter from "./routes/userRouter.js"
import socketController from "./controllers/socketController.js"
import Room from "./models/room.entity.js"

// const HTTPS_PORT = process.env.HTTPS_PORT || 8080
const HTTP_PORT = process.env.HTTP_PORT || 8000
const DB_URL = process.env.DB_URL || "test"
declare global {
    namespace Express {
        interface Request {
            user: models.client.UserEntity.IUser
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
    if (user.email === email && await bcrypt.compare(password, user.password) && user.role === models.server.UserEntity.Role.ADMIN) {
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
        {resource: Room}
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

server.use(cors(corsOptions));
// server.use(morgan("dev"));
server.use(express.json());
server.use(express.urlencoded({ extended: true }));

server.use(admin.options.rootPath, adminRouter)
server.use('/api/auth', authRouter)
server.use('/api/chat', chatRouter)
server.use('/api/users', userRouter)


const httpServer = http.createServer(server).listen(HTTP_PORT, () => {
    console.log(`HTTPS server is listening at http://localhost:${HTTP_PORT} 🚀`)
    console.log(`Admin Panel started on http://localhost:${HTTP_PORT}${admin.options.rootPath}`)
});

export const io = new Server(httpServer, { 
    cors: corsOptions
});
export const adminSessions = new Map<string, string>();
export const userSessions = new Map<string, string>();
io.use(authSocketMiddleware);
io.on("connection", (socket) => {
    socket.user.role === models.client.UserEntity.Role.ADMIN ?
        adminSessions.set(socket.user.id, socket.id)
        :
        userSessions.set(socket.user.id, socket.id)

    console.log('User connected:', socket.user.id)

    socket.on('join-room', (roomID: string, user: models.client.UserEntity.IUser, callback: (status: {ok: boolean}) => void) => {
        try {
            socket.join(roomID)
            socket.broadcast.to(roomID).emit(`companion-joined-chat-${roomID}`)
            if(user.role === models.client.UserEntity.Role.CUSTOMER) {
                for(let adminSession of adminSessions) {
                    socket.to(adminSession[1]).emit(`user-joined-chat-${roomID}`, roomID)
                }
            }
            callback({ok: true})
        } catch (error) {
            callback({ok: false})
        }
    })

    socket.on('get-room-users-online', async (roomID: string, callback: (status: {online: number}) => void) => {
        const sockets = await io.in(roomID).fetchSockets();
        callback({online: sockets.length});
    })

    socket.on('get-companion-data', async (roomID: string, requestUser: models.client.UserEntity.IUser, callback:  (status: {ok: boolean}, companion: {name: string, email: string, online: boolean} | null) => void) => {
        try {
            const room = await Room.findById(roomID).exec()
            const sockets = await io.in(roomID).fetchSockets();
            let name: string = '', email: string = '';
            if(requestUser.role === models.client.UserEntity.Role.ADMIN) {
                try {
                    const user = await User.findById(room!.ownerID).exec()
                    name = user!.fullName
                    email = user!.email
                } catch (error) {
                    name = "Анонимный пользователь"
                    email = "noemail@example.com"
                }
            } else {
                name = "Администратор"
                email = "intermobi@yahoo.com"
            }
            callback({ok: true}, {name, email, online: sockets.length > 1});
        } catch (error) {
            callback({ok: false}, null);
        }
    })



    socket.on('create-room-try', (message: models.client.RoomEntity.Message, callback: (status: {ok: boolean, roomID: string, error: string | null}) => void) => {
        socketController.createRoom(socket, message, callback)
    })

    socket.on('message-send-try', (message: models.client.RoomEntity.Message, callback: (status: {ok: boolean, error: string | null}) => void) => {
        socketController.sendMessageToRoom(socket, message, callback)
    })

    socket.on('room-read-try', (roomID: string, user: models.client.UserEntity.IUser, callback: (status: {ok: boolean, error: string | null}) => void) => {
        socketController.readMessageInRoom(socket, roomID, user, callback)
    })



    socket.on('leave-room', (roomID: string, user: models.client.UserEntity.IUser) => {
        try {
            socket.leave(roomID)
            socket.broadcast.to(roomID).emit(`companion-disjoined-chat-${roomID}`)
            if(user.role === models.client.UserEntity.Role.CUSTOMER) {
                for(let adminSession of adminSessions) {
                    socket.to(adminSession[1]).emit(`user-disjoined-chat-${roomID}`, roomID)
                }
            }

        } catch (error) {
            console.error(`Error occured: ${error}`)
        }
    })

    socket.on('disconnect', () => {
        socket.user.role === models.client.UserEntity.Role.ADMIN ?
            adminSessions.delete(socket.user.id)
            :
            userSessions.delete(socket.user.id)
        console.log('User disconnected:', socket.user.id);
    });
});
