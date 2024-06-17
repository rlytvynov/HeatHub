import mongoose from 'mongoose';

export interface IRoom extends models.server.RoomEntity.IRoom {}

const roomsSchema = new mongoose.Schema<IRoom>({
    ownerID: { type: String, required: true },
    messages: { type: [], require: true },
    readByAdmin: { type: Boolean, require: true },
    readByUser: { type: Boolean, require: true },
})

const Room = mongoose.model<IRoom>('Room', roomsSchema)
export default Room