import { Socket } from 'socket.io';

declare module 'socket.io' {
    interface Socket {
        user: models.client.UserEntity.IUser
    }
}