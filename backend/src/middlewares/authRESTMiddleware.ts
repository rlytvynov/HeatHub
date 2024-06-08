import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken"
export function authRESTMiddleware(req: Request, res: Response, next: NextFunction) {
    const bearerToken = req.headers.authorization
    if (!bearerToken || !bearerToken.startsWith('Bearer ')) {
        res.status(401).json({ message: 'Unauthorized: Bearer token missing' });
        return;
    }
    const token = bearerToken.split(' ')[1];
    try {
        jwt.verify(token, process.env.JWT_SECRET_KEY || "secret", (error, user) => {
            if (error) {
                throw (new Error());
            }
            const {iat, exp, ...iUser} = user as JwtPayload
            req.user = iUser as UserEntity.IUser
            next();
        });
      } catch (error) {
        res.status(401).json({ message: 'Unauthorized: Invalid token' });
      }
}