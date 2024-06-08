import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken"
import { v4 as uuidv4 } from 'uuid';
export function authSocketMiddleware(req: Request, res: Response, next: NextFunction) {
    const bearerToken = req.headers.authorization;
    if(!bearerToken) {
        req.user = null
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
                const {iat, exp, ...iUser} = user as JwtPayload
                req.user = iUser as UserEntity.IUser
                next();
            });  
        } catch (error) {
            return next(new Error("Invalid token"));
        }
    }
}