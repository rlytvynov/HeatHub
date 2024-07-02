declare module "cart-backend" {
    export interface itemCart {
        _id: object
        name: string
        image: string
        price: number
        model: string
        amount: number
    }
    export interface iCart{
        _id: object,
        holderId: string,
        items: itemCart[]
    }
}