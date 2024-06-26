import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken"
import { v4 as uuidv4 } from "uuid";
export function authRESTMiddleware(req: Request, res: Response, next: NextFunction) {
    const bearerToken = req.headers.authorization
    if (!bearerToken || !bearerToken.startsWith('Bearer ')) {
        return res.status(401).json({ id: uuidv4(), role: models.client.UserEntity.Role.CUSTOMER, message: 'Unauthorized: Invalid token' });
    }
    const token = bearerToken.split(' ')[1];
    try {
        jwt.verify(token, process.env.JWT_SECRET_KEY || "secret", (error, user) => {
            if (error) {
                throw (new Error());
            }
            const {iat, exp, ...iUser} = user as JwtPayload
            req.user = iUser as models.client.UserEntity.IUser
            next();
        });
      } catch (error) {
        return res.status(401).json({ id: uuidv4(), role: models.client.UserEntity.Role.CUSTOMER, message: 'Unauthorized: Invalid token' });
      }
}