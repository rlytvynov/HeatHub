declare module "item-backend" {
    export interface item {
        _id: object,
        image: string,
        name: string,
        model: string,
        price: number
        description: string
        type: 'tubular' | 'bps'
        tags?: Array<string>
    }

    namespace Tubular {
        export type FittingDiameterType = '10mm' | '12mm' | '14mm' | '16mm' | '18mm' | '1/2"' | '22mm'
        export type TubeDiameterType =  '13.5mm' | '10mm' | '8.5mm' | '6.5mm'
        export type ShapeType = 'spiral' | 'staple' | 'uShape' | 'straight'
        export type SubcategoryType = 'air' | 'water' | 'general'
        export interface itubular extends item {
            wattage: number
            tubeDiameter: TubeDiameterType
            fittingDiameter: FittingDiameterType
            shape: ShapeType
            subCategory: SubcategoryType
            purpose: string
        }
    }

    namespace BPS {
        export type Voltage = '12v' | '24v' | '36v' | '48v'
        export type SubcategoryType = 'solar-panels' | 'controllers' | 'invertors'
        export interface ibps extends item {
            voltage: Voltage
            wattage?: number
            size?: number
            ampers?: number
            subCategory: SubcategoryType
        }
    }
}