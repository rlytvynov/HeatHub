import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken"
import { iuser } from "user-frontend";

export function authRESTMiddleware(req: Request, res: Response, next: NextFunction) {
    const bearerToken = req.headers.authorization
    if (!bearerToken || !bearerToken.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Unauthorized: Invalid token' });
    }
    const token = bearerToken.split(' ')[1];
    try {
        jwt.verify(token, process.env.JWT_SECRET_KEY || "secret", (error, user) => {
            if (error) {
                throw (new Error());
            }
            const {iat, exp, ...other} = user as JwtPayload
            req.user = other as iuser
            next();
        });
      } catch (error) {
        return res.status(401).json({message: 'Unauthorized: Invalid token' });
      }
}