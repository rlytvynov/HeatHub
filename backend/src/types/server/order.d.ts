declare module "order-backend" {
    export type Status = 'processing' | 'sended' | 'delivered'
    export interface iorder {
        _id: object
        receiverId: string
        status: Status
        file: string
    }
}