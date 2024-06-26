export namespace models {
    export interface Identifiable {
        id: string
    }
    /** 
     * CLIENT Namespace for room-related entities and types
     */ 
    export namespace RoomEntity {
        export type Message = {
            roomID?: string,
            senderID: string,
            content: {
                text: string,
                time: string
            }
        }
        export interface IRoom extends Identifiable {
            ownerID: string,
            messages: Message[],
            readByAdmin: boolean,
            readByUser: boolean,
        }

    }

    /** 
     * Namespace for item-related entities and types
     */ 
    export namespace ItemEntity {
        export interface IItem extends Identifiable {

        }
    }

    /** 
     * Namespace for order-related entities and types
     */ 
    export namespace OrderEntity {
        export const enum OrderStatus {
            PROCESSED = "PROCESSED",
            SENDED = "SENDED",
            DELIVERED = "DELIVERED"
        }

        export interface IOrder extends Identifiable {
            orderStatus: OrderStatus;
            orderFile: File | null
        }
    }

    /** 
     * CLIENT Namespace for user-related entities and types
     */ 
    export namespace UserEntity.Auth {
        export const enum Role {
            ADMIN = "admin",
            CUSTOMER = "customer"
        }
        export interface IUser extends models.Identifiable {
            role: Role;
        }
    }

    export namespace UserEntity.Data {
        const enum Country {
            RUSSIA = "Россия 🇷🇺",
            BELARUS = "БЕЛАРУСЬ 🇧🇾",
            KAZAKHSTAN = "КАЗАХСТАН 🇰🇿",
            UZBEKISTAN = "УЗБЕКИСТАН 🇺🇿",
            AZERBAIJAN = "АЗЕРБАЙДЖАН 🇦🇿",
            TURKMENISTAN = "ТУРКМЕНИСТАН 🇹🇲",
            GEORGIA = "ГРУЗИЯ 🇬🇪",
            ARMENIA = "АРМЕНИЯ 🇦🇲",
            KYRGYZSTAN = "КИРГИЗСТАН 🇰🇬",
            TAJIKISTAN = "ТАДЖИКИСТАН 🇹🇯"
        }
        
        export type Notification = {
            notificationOrdersStatus: boolean;
            notificationCommentsStatus: boolean;
            notificationMessagesFromAdminStatus: boolean;
            notificationNewItemsStatus: boolean;
        };
    
        export interface IUserData {
            email: string;
            fullName: string;
            phoneNumber?: string;
            country?: Country;
            address?: string;
            postCode?: number;
            notifications: Notification;
            orders?: models.OrderEntity.IOrder[];
            bag?: models.ItemEntity.IItem[];
        }
    }
}