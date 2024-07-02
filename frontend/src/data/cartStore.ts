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
    public uploaded: boolean = false
    public isChanged: boolean = false

    public async loadBagItems() {
        try {
            
            this.bagItems =  await CartService.getCart()
            // this.bagItems = [
            //     {
            //         id: "1",
            //         image: "https://www.sanhua-aweco.com/uploads/images/products/aweco-049_list-no-12_tubular-heating-elements_washing-machine-heating-element_several-1_250_250.png",
            //         name: "Deluxe Tubular Radiator",
            //         model: "DT-100",
            //         price: 199.99,
            //         amount: 1
            //     },
            //     {
            //         id: "2",
            //         image: "https://www.sanhua-aweco.com/uploads/images/products/aweco-056_list-no_250_250.png",
            //         name: "Compact BPS Heater",
            //         model: "BPS-200",
            //         price: 149.99,
            //         amount: 1
            //     },
            //     {
            //         id: "3",
            //         image: "https://www.sanhua-aweco.com/uploads/images/products/aweco-049_list-no-12_tubular-heating-elements_washing-machine-heating-element_several-1_250_250.png",
            //         name: "Eco-Friendly Tubular Radiator",
            //         model: "ET-300",
            //         price: 249.99,
            //         amount: 3
            //     },
            //     {
            //         id: "4",
            //         image: "https://pngimg.com/d/solar_panel_PNG127.png",
            //         name: "Luxury BPS Radiator",
            //         model: "LB-400",
            //         price: 299.99,
            //         amount: 1
            //     },
            //     {
            //         id: "5",
            //         image: "https://www.amerescosolar.com/wp-content/uploads/ve-bluesolar-12-24-lcdusb-5.png",
            //         name: "Standard Tubular Radiator",
            //         model: "ST-500",
            //         price: 179.99,
            //         amount: 2
            //     }
            // ]
            this.uploaded = true
            this.emitChange();
        } catch (error: any) {
            alert("Схуяле?")
        }
    }
    public updateCartWithNewItem(item: itemCart) {
        if(this.bagItems.find(_item => _item.id === item.id)) {
            this.updateCartWithItem(item.id, 'increment', item.amount)
            return
        } else {
            this.bagItems = [...this.bagItems, item]
            this.isChanged = true
            this.emitChange()
        }
    }

    public updateCartWithItem(id: string, type: 'increment' | 'decrement', amount?: number) {
        let wasChanged: boolean = false
        this.bagItems = this.bagItems.map(item => {
            if(item.id === id) {
                if(type === 'increment') {
                    amount? item.amount+=amount : item.amount++
                    wasChanged = true
                } else {
                    if(item.amount !== 0) {
                        item.amount--
                    }
                    wasChanged = true
                }
            }
            return item.amount > 0 ? item : undefined;
        }).filter(item => item !== undefined) as itemCart[]

        if(wasChanged) {
            this.isChanged = true
            this.emitChange()
        }
    }

    public async save() {
        try {
            await CartService.updateCart(this.bagItems)
            this.isChanged = false
            this.emitChange()
        } catch (error: any) {
            alert("Ошибка сохранения корзины")
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