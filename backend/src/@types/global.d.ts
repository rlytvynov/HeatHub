/**
 * Global namespaces
 */
import mongoose from "mongoose";
declare global {
    interface Identifiable {
        _id: mongoose.Types.ObjectId;
    }
    /** 
     * Namespace for room-related entities and types
     */ 
    namespace RoomEntity {
        type Message = {
            roomID: string | null,
            senderID: string | null,
            content: {
                text: string,
                time: string
            }
        }
        
        interface IRoom extends Identifiable {
            ownerID: string | null,
            messages: Message[],
            readByAdmin: boolean,
            readByUser: boolean,
        }
    }
    /** 
     * Namespace for item-related entities and types
     */ 

    namespace ItemEntity {
        interface IItem extends Identifiable {

        }
    }
    /** 
     * Namespace for order-related entities and types
     */ 
    namespace OrderEntity {
        const enum OrderStatus {
            PROCESSED = "PROCESSED",
            SENDED = "SENDED",
            DELIVERED = "DELIVERED"
        }

        interface IOrder extends Identifiable {
            orderStatus: OrderStatus;
            orderFile: File | null
        }
    }

    /** 
     * Namespace for user-related entities and types
     */ 
    namespace UserEntity {
        const enum Role {
            ADMIN = "ADMIN",
            CUSTOMER = "CUSTOMER",
        }

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

        const CountryValues: Country[] = [
            Country.RUSSIA,
            Country.BELARUS,
            Country.KAZAKHSTAN,
            Country.UZBEKISTAN,
            Country.AZERBAIJAN,
            Country.TURKMENISTAN,
            Country.GEORGIA,
            Country.ARMENIA,
            Country.KYRGYZSTAN,
            Country.TAJIKISTAN
        ];

        type Notification = {
            notificationOrdersStatus: boolean;
            notificationCommentsStatus: boolean;
            notificationMessagesFromAdminStatus: boolean;
            notificationNewItemsStatus: boolean;
        };

        interface IUser extends Identifiable {
            email: string;
            fullName: string;
            role: Role
            phoneNumber: string | null;
            country: Country | null;
            address: string | null;
            postCode: number | null;
            notifications: Notification;
            orders: OrderEntity.IOrder[];
            bag: ItemEntity.IItem[];
        }
    }
    
}

export {}