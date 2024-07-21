declare module "order" {
    export type Status = 'processing' | 'sended' | 'deliverd'
    export interface iorder {
        id: string,
        receiverId: string
        status: Status,
        orderDate: Date,
        file?: File,
    }
}