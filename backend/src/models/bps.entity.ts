import mongoose from 'mongoose';
import { BPS } from 'item-backend';

export interface IBps extends BPS.ibps {}

const bpsSchema = new mongoose.Schema<IBps>({
    image: { type: String, required: true },
    name: { type: String, required: true },
    model: { type: String, required: true },
    price: { type: Number, required: true },
    description: { type: String, required: true },
    type: { type: String, enum: ['tubular', 'bps'], required: true },
    tags: { type: [String] },
    subCategory: { type: String, enum: ['solar-panels' , 'controllers' , 'invertors'], required: true },
    voltage: {type: String, enum: ['12v', '24v', '36v', '48v'], required: true},
    wattage: { type: Number},
    ampers: { type: Number },
    size: { type: Number},
})

const Bps = mongoose.model<IBps>('Bps', bpsSchema)
export default Bps