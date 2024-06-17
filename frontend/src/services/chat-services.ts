import { models } from "../types/models"
import fetchData from "./zFetcher";
interface ChatFetchInterface {
    getRoomById: (id: string) => Promise<models.RoomEntity.IRoom>
    getMyRoom: () => Promise<models.RoomEntity.IRoom>
    getRooms: () => Promise<models.RoomEntity.IRoom[]>
}

class ChatServiceClass implements ChatFetchInterface {
    async getRoomById(roomID: string): Promise<models.RoomEntity.IRoom> {
        try {
            return fetchData<models.RoomEntity.IRoom>(`${process.env.REACT_APP_API_URL}/api/chat/rooms/${roomID}`);
        } catch (error) {;
            throw error;
        }
    }

    async getMyRoom(): Promise<models.RoomEntity.IRoom> {
        try {
            const options = {
                headers: {
                    'Authorization': localStorage.getItem("token") || ""
                }
            };
            return fetchData<models.RoomEntity.IRoom>(`${process.env.REACT_APP_API_URL}/api/chat/room`, options);
        } catch (error) {
            throw error;
        }
    }

    async getRooms(): Promise<models.RoomEntity.IRoom[]> {
        try {
            const options = {
                headers: {
                    'Authorization': localStorage.getItem("token") || ""
                }
            };
            return fetchData<models.RoomEntity.IRoom[]>(`${process.env.REACT_APP_API_URL}/api/chat/rooms`, options);
        } catch (error) {
            throw error;
        }
    }
}

const ChatService = new ChatServiceClass()
export default ChatService
