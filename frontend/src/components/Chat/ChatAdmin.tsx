import { useEffect, useState } from 'react'
import styles from "../../styles/pages/Home.module.scss"
import chatStyles from "../../styles/components/Chat.module.scss"
import Chat from './Chat'
import ChatService from '../../services/chat-services'
import { useAuthContext } from '../../contexts/AuthProvider'
import { RoomEntity } from "../../global";
import { useSocketContext } from '../../contexts/SocketProvider'

type RoomsInterface = {
    currentRoom: RoomEntity.IRoom,
    rooms: RoomEntity.IRoom[],
}

const initialState: RoomsInterface = {
    currentRoom: {
        _id: "",
        messages: [],
        readByAdmin: false,
        readByUser: false
    },
    rooms: [],
}


const ChatAdmin = () => {
    const socketContext = useSocketContext()
    const [roomsState, setRoomsState] = useState<RoomsInterface>(initialState);
    const authContext = useAuthContext()
    useEffect(() => {
        const handleRoomCreated = (newRoom: RoomEntity.IRoom) => {
            console.log("aaaaaaaaa")
            setRoomsState(prevRooms => ({
                ...prevRooms,
                rooms: [...prevRooms.rooms, newRoom]
            })) // Append the new room to the existing array of rooms
        };

        const handleRoomUpdate = (message: RoomEntity.Message) => {
            if(message.roomID !== roomsState.currentRoom._id) {
                setRoomsState(prevRooms => {
                    const updatedRooms = prevRooms.rooms.map(room => {
                        if (room._id === message.roomID) {
                            // Update room properties
                            return {
                                ...room,
                                readByAdmin: false,
                                messages: [...room.messages, message]
                            };
                        }
                        return room;
                    });
                    return {
                        ...prevRooms,
                        rooms: updatedRooms
                    };
                });
            } else {
                setRoomsState(prevRooms => {
                    return prevRooms
                })
            }
        };

        async function getRooms() {
            const rooms = await ChatService.getRooms()
            setRoomsState(prevRooms => ({
                ...prevRooms,
                rooms: [...prevRooms.rooms, ...rooms]
            }))
        } 

        getRooms()

        socketContext!.socket.on('room-created', handleRoomCreated);
        socketContext!.socket.on('message-receive', handleRoomUpdate);
        return () => {
            socketContext!.socket.off('room-created', handleRoomCreated);
            socketContext!.socket.off('message-receive', handleRoomUpdate)
        }
        // eslint-disable-next-line
    }, [socketContext!.socket])

    const handleActiveRoom = (roomID: string) => {
        console.log(roomsState.currentRoom)
        if(roomsState.currentRoom._id !== roomID) {
            const rooms = [...roomsState.rooms]
            for (let i = 0; i < rooms.length; i++) {
                if(rooms[i]._id === roomID) {
                    rooms[i].readByAdmin = true
                    socketContext!.socket.emit('message-read-try', authContext!.authState.user!._id, rooms[i]._id, (status: {ok: boolean, error: string | null}) => {
                        if(status.ok) {
                            setRoomsState(prevRooms => ({
                                ...prevRooms,
                                currentRoom: {...rooms[i]},
                            }))
                        } else {
                            console.error('Failed to read message:', status.error);
                        }
                    });
                    break
                }
            }
        }
    }

    return (
        <>
            <div className={`${styles.chatHeader}`}>Чат с клиентами</div>
            <div className={styles.chatAdmin}>
                <div className={styles.customers}>
                    {
                        roomsState.rooms.map((room, key) => {
                            return (
                                <div onClick={() => handleActiveRoom(room._id)} key={key} 
                                    className={
                                        `${styles.customer} 
                                        ${styles[`${!room.readByAdmin}`]}
                                        ${`${room._id === roomsState.currentRoom._id ? styles.active : ""}`}
                                        `
                                    }>
                                    <div className={styles.user}>
                                        <img src={process.env.PUBLIC_URL + "/images/user.png"} alt="" />
                                        <div className={styles.userName}>User</div>
                                    </div>
                                </div>
                            )
                        })
                    }
                </div>
                {
                    roomsState.currentRoom._id !== "" ? <Chat room={roomsState.currentRoom}/> : <div className={chatStyles.room0}> Выберите пользователя </div>
                }
            </div>
        </>
    )
}

export default ChatAdmin