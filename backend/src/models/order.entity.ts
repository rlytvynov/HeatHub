import { itemCart } from 'cart-backend';
import mongoose from 'mongoose'
import { iorder } from 'order-backend';

export interface IOrder extends iorder {
    items: itemCart[]
}

const cartSchema = new mongoose.Schema<IOrder>({
    receiverId: {type: String, required: true},
    status: {type: String, required: true},
    file: {type: String},
    items: [{} as unknown as itemCart]
})

const Order = mongoose.model<IOrder>('Order', cartSchema)
export default Order