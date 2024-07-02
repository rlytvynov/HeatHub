declare module "room" {
    /**
     * Represents a message in a room.
     * @typedef {Object} message
     * @property {string} [roomID] - The ID of the room (Undefined while first time send message).
     * @property {string} senderID - The ID of the sender.
     * @property {Object} content - The content of the message.
     * @property {string} content.text - The text content of the message.
     * @property {string} content.time - The timestamp when the message was sent.
     */
    export type message = {
        roomID?: string;
        senderID: string;
        content: {
            text: string;
            time: string;
        };
    };

    /**
     * Interface representing a room.
     * @interface iroom
     */
    export interface iroom {
        /**
         * The ID of the room.
         * @type {string}
         */
        id: string;

        /**
         * The ID of the owner of the room.
         * @type {string}
         */
        ownerID: string;

        /**
         * Array of messages sent in the room.
         * @type {message[]}
         */
        messages: message[];

        /**
         * Indicates whether the room has been read by the admin.
         * @type {boolean}
         */
        readByAdmin: boolean;

        /**
         * Indicates whether the room has been read by the user.
         * @type {boolean}
         */
        readByUser: boolean;
    }
}
