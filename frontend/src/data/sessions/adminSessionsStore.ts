import { iuser } from "user";
import fetchData from "../../utils/fetcher";

interface IAdminSessionsExternalStore {
    loadOnlineAdmins: () => void;
    adminDisconnected: (user: iuser) => void;
    adminConnected: (user: iuser) => void;
    subscribe: (listener: () => void) => () => void;
    getSnapshot(): string[]
}

export class AdminSessionsExternalStore implements IAdminSessionsExternalStore {
    private onlineAdmins: string[] = []
    private listeners: (() => void)[] = [];

    public async loadOnlineAdmins() {
        const arr = await fetchData<{admins: string[]}>(`${process.env.REACT_APP_API_URL}/api/online?type=admins`)
        this.onlineAdmins = [...this.onlineAdmins, ...arr.admins]
        this.emitChange();
    }

    public adminConnected(user: iuser)  {
        this.onlineAdmins = [...this.onlineAdmins, user.id]
        this.emitChange();
    }

    public adminDisconnected(user: iuser) {
        this.onlineAdmins = this.onlineAdmins.filter(id => id !== user.id)
        this.emitChange();
    }

    public isAdminOnline(): boolean {
        return this.onlineAdmins.length !== 0
    }

    public getSnapshot(): string[] {
        return this.onlineAdmins
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
export const adminSessionsStore = new AdminSessionsExternalStore();