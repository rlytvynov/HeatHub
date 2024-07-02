import mongoose from 'mongoose';
import { iroom } from 'room-server';

export interface IRoom extends iroom {}

const roomsSchema = new mongoose.Schema<IRoom>({
    ownerID: { type: String, required: true },
    messages: { type: [], require: true },
    readByAdmin: { type: Boolean, require: true },
    readByUser: { type: Boolean, require: true },
})

const Room = mongoose.model<IRoom>('Room', roomsSchema)
export default Room