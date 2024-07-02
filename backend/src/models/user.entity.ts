import mongoose from 'mongoose';
import { iuserExtend, role } from 'user-server';

export interface IUser extends iuserExtend {
    password: string;
}

const UserSchema = new mongoose.Schema<IUser>({
    email: { type: String, require: true, unique: true },
    password: { type: String, require: true },
    fullName: { type: String, require: true },
    role: { type: String, enum: ["admin", "customer"], require: true },
    phoneNumber: { type: String, default: null },
    country: { type: String, default: null },
    address: { type: String, default: null },
    postCode: { type: Number, default: null },
    notifications: { type: {}, default: { notificationOrdersStatus: true, notificationCommentsStatus: false, notificationMessagesFromAdminStatus: true, notificationNewItemsStatus: false} },
})

export const User = mongoose.model<IUser>('User', UserSchema);