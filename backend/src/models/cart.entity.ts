import mongoose from 'mongoose';
import { iCart, itemCart } from 'cart-backend';

export interface ICart extends iCart {}

const cartSchema = new mongoose.Schema<ICart>({
    holderId: {type: String, required: true},
    items: [{} as unknown as itemCart]
})

const Cart = mongoose.model<ICart>('Cart', cartSchema)
export default Cart