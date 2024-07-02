import mongoose from 'mongoose';
import { Tubular } from 'item-backend';

export interface ITubular extends Tubular.itubular {}

const tubularSchema = new mongoose.Schema<ITubular>({
    image: { type: String, required: true },
    name: { type: String, required: true },
    model: { type: String, required: true },
    price: { type: Number, required: true },
    description: { type: String, required: true },
    type: { type: String, enum: ['tubular', 'bps'], required: true },
    tags: { type: [String] },
    wattage: { type: Number, required: true },
    tubeDiameter: { type: String, enum: ['13.5mm', '10mm', '8.5mm', '6.5mm'], required: true },
    fittingDiameter: { type: String, enum: ['10mm', '12mm', '14mm', '16mm', '18mm', '1/2"', '22mm'], required: true },
    shape: { type: String, enum: ['spiral', 'staple', 'uShape', 'straight'], required: true },
    subCategory: { type: String, enum: ['air', 'water', 'general'], required: true },
    purpose: { type: String, required: true },
})

const Tubular = mongoose.model<ITubular>('Tubular', tubularSchema)
export default Tubular