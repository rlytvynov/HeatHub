import { iuser } from "user";
import fetchData from "../../utils/fetcher";

interface IUserSessionsExternalStore {
    loadOnlineUsers: () => void;
    userDisconnected: (user: iuser) => void;
    userConnected: (user: iuser) => void;
    subscribe: (listener: () => void) => () => void;
    getSnapshot(): string[]
}

export class UserSessionsExternalStore implements IUserSessionsExternalStore {
    private onlineUsers: string[] = []
    private listeners: (() => void)[] = [];

    public async loadOnlineUsers() {
        const arr = await fetchData<{users: string[]}>(`${process.env.REACT_APP_API_URL}/api/online?type=users`)
        this.onlineUsers = [...this.onlineUsers, ...arr.users]
        this.emitChange();
    }

    public userConnected(user: iuser)  {
        this.onlineUsers = [...this.onlineUsers, user.id]
        this.emitChange();
    }

    public isUserOnline(id: string): boolean {
        return this.onlineUsers.find(_id => _id = id)?.length !== 0
    }

    public userDisconnected(user: iuser) {
        this.onlineUsers = this.onlineUsers.filter(id => id !== user.id)
        this.emitChange();
    }

    public getSnapshot(): string[] {
        return this.onlineUsers
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
export const userSessionsStore = new UserSessionsExternalStore();