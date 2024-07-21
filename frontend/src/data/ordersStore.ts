import { iorder } from "order";
import CartService from "../services/cart-services";

export interface IOrdersExternalStore {
    loadBagItems: () => void;
    subscribe: (listener: () => void) => () => void;
    getSnapshot(): iorder
}

// export class OrderExternalStore implements  IOrdersExternalStore {
//     private orderItems: itemCart[] = []
//     private listeners: (() => void)[] = [];
//     public isUploaded: boolean = false
//     public isChanged: boolean = false

//     public async loadBagItems() {
//         try {
//             this.bagItems =  await CartService.getCart()
//             this.isUploaded = true
//             this.emitChange();
//         } catch (error: any) {
//             alert("Ошибка загрузки корзины")
//         }
//     }
//     public updateCartWithNewItem(item: itemCart) {
//         if(this.bagItems.find(_item => _item.id === item.id)) {
//             this.updateCartWithItem(item.id, 'increment', item.amount)
//             return
//         } else {
//             this.bagItems = [...this.bagItems, item]
//             this.isChanged = true
//             this.emitChange()
//         }
//     }

//     public updateCartWithItem(id: string, type: 'increment' | 'decrement', amount?: number) {
//         let wasChanged: boolean = false
//         this.bagItems = this.bagItems.map(item => {
//             if(item.id === id) {
//                 if(type === 'increment') {
//                     amount? item.amount+=amount : item.amount++
//                 } else {
//                     if(item.amount !== 0) {
//                         item.amount--
//                     }
//                 }
//                 wasChanged = true
//             }
//             return item.amount > 0 ? item : undefined;
//         }).filter(item => item !== undefined) as itemCart[]

//         if(wasChanged) {
//             this.isChanged = true
//             this.emitChange()
//         }
//     }

//     public subscribe(listener: () => void):  () => void  {
//         this.listeners = [...this.listeners, listener];
//         return () => {
//             this.listeners = this.listeners.filter(l => l !== listener);
//         };
//     }

//     public getSnapshot(): itemCart[] {
//         return this.bagItems;
//     }

//     private emitChange() {
//         for (let listener of this.listeners) {
//             listener();
//         }
//     };
// }
// export const cartStore = new CartExternalStore();