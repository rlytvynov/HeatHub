import { iroom, message } from "room";
import fetchData from "../../utils/fetcher";

interface IRoomExternalStore {
    loadRoomById: (id: string) => void
    loadRoom: () => void
    getSnapshot(): iroom | undefined
    subscribe: (listener: () => void) => () => void;
}

export class RoomExternalStore implements IRoomExternalStore {
    private room?: iroom
    private listeners: (() => void)[] = [];
    public async loadRoomById(id: string) {
        try {
            this.room = await fetchData<iroom>(`${process.env.REACT_APP_API_URL}/api/chat/rooms/${id}`);
            this.emitChange();
        } catch (error) {
            this.room = undefined
            this.emitChange()
            throw error;
        }
    }
    public async loadRoom() {
        try {
            const options = {
                headers: {
                    'Authorization': localStorage.getItem("token") || ""
                }
            };
            this.room = await fetchData<iroom>(`${process.env.REACT_APP_API_URL}/api/chat/room`, options);
            this.emitChange()
        } catch (error) {
            this.room = undefined
            this.emitChange()
            throw error;
        }
    }

    public refreshRoom(room: iroom) {
        this.room = room
        this.emitChange()
    }
    public getSnapshot(): iroom | undefined {
        return this.room
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
export const roomStore = new RoomExternalStore();