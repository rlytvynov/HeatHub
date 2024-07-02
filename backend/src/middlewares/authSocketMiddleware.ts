import jwt from "jsonwebtoken"
import { Socket } from "socket.io";
import { iuser, iuserExtend, role } from "user-frontend";

export function authSocketMiddleware(socket: Socket, next: (err?: any) => void) {
    const bearerToken = socket.handshake.headers.authorization as string;
    if(!bearerToken) {
        const userID = socket.handshake.query.id as string
        const userRole = socket.handshake.query.role as role
        socket.user = {  
            id: userID, 
            role: userRole
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
                    id: (user as iuserExtend).id,
                    role: (user as iuserExtend).role
                } 
                next();
            });  
        } catch (error) {
            return next(new Error("Invalid token"));
        }
    }
}