import { RoomEntity } from "../global";

interface ChatFetchInterface {
    getRoomById: (id: string) => Promise<RoomEntity.IRoom>
    getMyRoom: () => Promise<RoomEntity.IRoom>
    getRooms: () => Promise<RoomEntity.IRoom[]>
}


class ChatServiceClass implements ChatFetchInterface {
    async getRoomById(roomID: string): Promise<RoomEntity.IRoom>{
        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}/api/chat/rooms/${roomID}`, {
                method: "GET",
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                },
            })
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message);
            }
            const room = await response.json();
            return room;
        } catch (error) {;
            throw error;
        }
    }

    async getMyRoom() {
        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}/api/chat/room`, {
                method: "GET",
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': localStorage.getItem("token") || ""
                },
            })
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message);
            }
            const room = await response.json();
            return room;
        } catch (error) {
            throw error;
        }
    }

    async getRooms() {
        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}/api/chat/rooms`, {
                method: "GET",
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                },
            })
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message);
            }
            const rooms = await response.json();
            return rooms;
        } catch (error) {
            throw error;
        }
    }
}

const ChatService = new ChatServiceClass()
export default ChatService
