import mongoose from 'mongoose';

export interface IUser extends models.server.UserEntity.IUser{
    password: string;
}

const UserSchema = new mongoose.Schema<IUser>({
    email: { type: String, require: true, unique: true },
    password: { type: String, require: true },
    fullName: { type: String, require: true },
    role: { type: String, require: true },
    phoneNumber: { type: String, default: null },
    country: { type: String, default: null },
    address: { type: String, default: null },
    postCode: { type: Number, default: null },
    notifications: { type: {}, default: { notificationOrdersStatus: true, notificationCommentsStatus: false, notificationMessagesFromAdminStatus: true, notificationNewItemsStatus: false} },
    orders: { type: [], default: [] },
    bag: { type: [], default: [] },
})

export const User = mongoose.model<IUser>('User', UserSchema);