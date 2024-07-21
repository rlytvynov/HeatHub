import { item } from "item";
import fetchData from "../utils/fetcher";
import CartService from "../services/cart-services";

export interface itemCart {
    id: string
    name: string
    image: string
    price: number
    model: string
    amount: number
}

interface ICartExternalStore {
    loadBagItems: () => void;
    subscribe: (listener: () => void) => () => void;
    getSnapshot(): itemCart[]
}

export class CartExternalStore implements  ICartExternalStore {
    private bagItems: itemCart[] = []
    private listeners: (() => void)[] = [];
    public isUploaded: boolean = false

    public async loadBagItems() {
        try {
            this.bagItems =  await CartService.getCart()
            this.isUploaded = true
            this.emitChange();
        } catch (error: any) {
            alert("Ошибка загрузки корзины")
        }
    }
    public async updateCartWithNewItem(item: itemCart) {
        try {
            if(this.bagItems.find(_item => _item.id === item.id)) {
                this.updateCartWithItem(item.id, 'increment', item.amount)
                return
            } else {
                this.bagItems = [...this.bagItems, item]
                await CartService.updateCart(this.bagItems)
                this.emitChange()
            } 
        } catch (error: any) {
            console.log(error.message)
            throw error
        }
    }

    public async updateCartWithItem(id: string, type: 'increment' | 'decrement', amount?: number) {
        try {
            let wasChanged: boolean = false
            this.bagItems = this.bagItems.map(item => {
                if(item.id === id) {
                    if(type === 'increment') {
                        amount? item.amount+=amount : item.amount++
                    } else {
                        if(item.amount !== 0) {
                            item.amount--
                        }
                    }
                    wasChanged = true
                }
                return item.amount > 0 ? item : undefined;
            }).filter(item => item !== undefined) as itemCart[]
    
            if(wasChanged) {
                await CartService.updateCart(this.bagItems)
                this.emitChange()
            }   
        } catch (error: any) {
            console.log(error.message)
            throw error
        }
    }

    public async clearCart() {
        try {
            await CartService.makeOrder(this.bagItems)
            await CartService.clearCart()
            this.bagItems = []
            this.emitChange()
        } catch (error: any) {
            console.log(error.message)
            throw error
        }
    }

    public subscribe(listener: () => void):  () => void  {
        this.listeners = [...this.listeners, listener];
        return () => {
            this.listeners = this.listeners.filter(l => l !== listener);
        };
    }

    public getSnapshot(): itemCart[] {
        return this.bagItems;
    }

    private emitChange() {
        for (let listener of this.listeners) {
            listener();
        }
    };
}
export const cartStore = new CartExternalStore();