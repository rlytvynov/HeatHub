
export interface Identifiable {
    _id: string;
}
/** 
 * Namespace for room-related entities and types
 */ 
export namespace RoomEntity {
    type Message = {
        roomID?: string,
        senderID?: string,
        content: {
            text: string,
            time: string
        }
    }
    interface IRoom extends Identifiable {
        ownerID?: string,
        messages: Message[],
        readByAdmin: boolean,
        readByUser: boolean,
    }

}
/** 
 * Namespace for item-related entities and types
 */ 
export namespace ItemEntity {
    interface IItem extends Identifiable {

    }
}
/** 
 * Namespace for order-related entities and types
 */ 
export namespace OrderEntity {
    type OrderStatus = "PROCESSED" | "SENDED" | "DELIVERED"
    interface IOrder extends Identifiable {
        orderStatus: OrderStatus;
        orderFile: File | null
    }
}

/** 
 * Namespace for user-related entities and types
 */ 
export namespace UserEntity {
    type Role = "ADMIN" | "CUSTOMER"
    type Country = "Россия 🇷🇺" | "БЕЛАРУСЬ 🇧🇾" | "КАЗАХСТАН 🇰🇿" | "УЗБЕКИСТАН 🇺🇿" | "АЗЕРБАЙДЖАН 🇦🇿"  | "ТУРКМЕНИСТАН 🇹🇲" | "ГРУЗИЯ 🇬🇪" | "АРМЕНИЯ 🇦🇲" | "КИРГИЗСТАН 🇰🇬" | "ТАДЖИКИСТАН 🇹🇯"
    type Notification = {
        notificationOrdersStatus: boolean;
        notificationCommentsStatus: boolean;
        notificationMessagesFromAdminStatus: boolean;
        notificationNewItemsStatus: boolean;
    };

    interface IUser extends Identifiable {
        email: string;
        fullName: string;
        role: Role;
        notifications: Notification;
        phoneNumber?: string;
        country?: Country;
        address?: string;
        postCode?: number;
        orders?: OrderEntity.IOrder[];
        bag?: ItemEntity.IItem[];
    }
}
