import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken"
import { Socket } from "socket.io";

export function authSocketMiddleware(socket: Socket, next: (err?: any) => void) {
    const bearerToken = socket.handshake.headers.authorization as string;
    if(!bearerToken) {
        const userID = socket.handshake.query.id as string
        const userRole = socket.handshake.query.role as models.client.UserEntity.Role
        socket.user = {  
            id: socket.handshake.query.id as string, 
            role: socket.handshake.query.role as models.client.UserEntity.Role
        } 
        next()
    } else {
        try {
            if (!bearerToken.startsWith("Bearer ")) {
                return next(new Error("Invalid token"));
            }
            const token = bearerToken.split(' ')[1];
            jwt.verify(token, process.env.JWT_SECRET_KEY || "secret", (error, user) => {
                if (error) {
                    throw new Error();
                }
                socket.user = { 
                    id: (user as models.client.UserEntity.IUser).id,
                    role: (user as models.client.UserEntity.IUser).role
                } 
                next();
            });  
        } catch (error) {
            return next(new Error("Invalid token"));
        }
    }
}