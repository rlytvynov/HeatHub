import { BPS } from "item";
import fetchData from "../../utils/fetcher";

interface IBpsExternalStore {
    loadBps: () => void;
    subscribe: (listener: () => void) => () => void;
    getSnapshot(): BPS.ibps[]
}

export class BpsExternalStore implements IBpsExternalStore {
    private bpsItems: BPS.ibps[] = []
    private listeners: (() => void)[] = [];
    public uploaded: boolean = false

    public async loadBps() {
        try {
            this.bpsItems = await fetchData<BPS.ibps[]>(`${process.env.REACT_APP_API_URL}/api/items/bps`)
            this.uploaded = true
            this.emitChange();
        } catch (error: any) {
            alert("Ошибка загрузки энергоносителей")
        }
    }

    public subscribe(listener: () => void):  () => void  {
        this.listeners = [...this.listeners, listener];
        return () => {
            this.listeners = this.listeners.filter(l => l !== listener);
        };
    }

    public getSnapshot(): BPS.ibps[] {
        return this.bpsItems;
    }

    private emitChange() {
        for (let listener of this.listeners) {
            listener();
        }
    };
}
export const bpsStore = new BpsExternalStore();