declare namespace models {
    namespace server {
        interface Identifiable {
            _id: object
        }

         /** 
         * Namespace for room-related entities and types
         */ 
        namespace RoomEntity {
            type Message = {
                roomID: string,
                senderID: string,
                content: {
                    text: string,
                    time: string
                }
            }
            
            interface IRoom extends models.server.Identifiable {
                ownerID: string,
                messages: Message[],
                readByAdmin: boolean,
                readByUser: boolean,
            }
        }

        /** 
         * Namespace for item-related entities and types
         */ 
        namespace ItemEntity {
            interface IItem extends models.server.Identifiable {

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

            interface IOrder extends models.server.Identifiable {
                orderStatus: OrderStatus;
                orderFile: File | null
            }
        }

        /** 
         * Namespace for user-related entities and types
         */ 
        namespace UserEntity {
            const enum Role {
                ADMIN = "admin",
                CUSTOMER = "customer",
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
            
            type Notification = {
                notificationOrdersStatus: boolean;
                notificationCommentsStatus: boolean;
                notificationMessagesFromAdminStatus: boolean;
                notificationNewItemsStatus: boolean;
            };

            interface IUser extends models.server.Identifiable {
                email: string;
                fullName: string;
                role: Role
                phoneNumber?: string;
                country?: Country;
                address?: string;
                postCode?: number;
                notifications: Notification;
                orders?: OrderEntity.IOrder[];
                bag?: ItemEntity.IItem[];
            }
        }
    }

    namespace client {
        interface Identifiable {
            id: string
        }

        /** 
         * CLIENT Namespace for room-related entities and types
         */ 
        namespace RoomEntity {
            type Message = {
                roomID?: string,
                senderID: string,
                content: {
                    text: string,
                    time: string
                }
            }
            interface IRoom extends models.client.Identifiable {
                ownerID: string,
                messages: Message[],
                readByAdmin: boolean,
                readByUser: boolean,
            }

        }

        /** 
         * CLIENT Namespace for user-related entities and types
         */ 
        namespace UserEntity {
            const enum Role {
                ADMIN = "admin",
                CUSTOMER = "customer"
            }
            interface IUser extends models.client.Identifiable {
                role: Role;
            }
        }
    }
}