import { Tubular } from "item";
import fetchData from "../../utils/fetcher";

interface ITubularExternalStore {
    loadTubulars: () => void;
    subscribe: (listener: () => void) => () => void;
    getSnapshot(): Tubular.itubular[]
}

export class TubularExternalStore implements ITubularExternalStore {
    private tubularItems: Tubular.itubular[] = []
    private listeners: (() => void)[] = [];
    public uploaded: boolean = false

    public async loadTubulars() {
        try {
            this.tubularItems = await fetchData<Tubular.itubular[]>(`${process.env.REACT_APP_API_URL}/api/items/tubulars`)
            this.uploaded = true
            this.emitChange();
        } catch (error: any) {
            alert("Ошибка загрузки тэнов")
        }
    }

    public subscribe(listener: () => void):  () => void  {
        this.listeners = [...this.listeners, listener];
        return () => {
            this.listeners = this.listeners.filter(l => l !== listener);
        };
    }

    public getSnapshot(): Tubular.itubular[] {
        return this.tubularItems;
    }

    private emitChange() {
        for (let listener of this.listeners) {
            listener();
        }
    };
}
export const tubularStore = new TubularExternalStore();