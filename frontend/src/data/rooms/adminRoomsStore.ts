import { iroom, message } from "room";
import fetchData from "../../utils/fetcher";

interface IAdminRoomsExternalStore {
    loadRooms: () => void
    refreshRoom: (room: iroom) => void
    getSnapshot(): iroom[]
    subscribe: (listener: () => void) => () => void;
}

export class AdminRoomsExternalStore implements IAdminRoomsExternalStore {
    private rooms: iroom[] = []
    private listeners: (() => void)[] = [];
    public async loadRooms() {
        try {
            const options = {
                headers: {
                    'Authorization': localStorage.getItem("token") || ""
                }
            };
            this.rooms = await fetchData<iroom[]>(`${process.env.REACT_APP_API_URL}/api/chat/rooms`, options);
            this.emitChange();
        } catch (error) {
            throw error;
        }
    }

    public roomAppeared(room: iroom) {
        this.rooms = [...this.rooms, room]
        this.emitChange();
    }

    public refreshRoom(refreshedRoom: iroom) {
        let isNewRoom: boolean = true
        this.rooms = this.rooms.map(room => {
            if (room.id === refreshedRoom.id) {
                isNewRoom = false
                return refreshedRoom
            }
            return room;
        });
        if(isNewRoom) {
            this.rooms = [...this.rooms, refreshedRoom]
        }
        this.emitChange();
    }

    public getSnapshot(): iroom[] {
        return this.rooms
    }
    public subscribe(listener: () => void):  () => void  {
        this.listeners = [...this.listeners, listener];
        return () => {
            this.listeners = this.listeners.filter(l => l !== listener);
        };
    }

    private emitChange() {
        for (let listener of this.listeners) {
            listener();
        }
    };
}
export const adminRoomsStore = new AdminRoomsExternalStore();