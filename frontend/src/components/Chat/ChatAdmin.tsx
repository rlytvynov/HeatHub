import { useCallback, useContext, useEffect, useState } from 'react'
import styles from "../../styles/components/Chat.module.scss"
import Chat from './Chat'
import ChatService from '../../services/chat-services'
import { models } from '../../types/models'
import UserService from '../../services/user-services'
import { SocketContext } from '../../contexts/SocketProvider'
import authHandler from '../../utils/authHandler'
import { AuthActionType, useAuthContext } from '../../contexts/AuthProvider'

export interface RoomsInterface {
    rooms: {id: string, ownerID: string, readByAdmin: boolean}[],
    currentRoom: string
}

export default function ChatAdmin () {
    const authContext = useAuthContext()
    const socket = useContext(SocketContext)
    const [roomsState, setRoomsState] = useState<RoomsInterface>({
        rooms: [],
        currentRoom: ""
    })

    useEffect(() => {
        async function getRooms() {
            try {
                const rooms = await ChatService.getRooms()
                setRoomsState((prevState) => ({
                    ...prevState,
                    rooms: rooms.map(room => ({id: room.id, ownerID: room.ownerID, readByAdmin: room.readByAdmin}))
                }))  
            } catch (error: any) {
                const errorJson = await JSON.parse(error.message)
                if(errorJson.status === 401) {
                    await authHandler(error.message)
                    authContext.dispatchAuthState({type: AuthActionType.DEAUTH_SUCCESS})
                } else {
                    alert(errorJson.message)
                }
            }
        } 
        getRooms()

        const handleRoomCreated = (newRoom: models.RoomEntity.IRoom) => {
            setRoomsState((prevState) => ({
                ...prevState, 
                rooms: [...prevState.rooms, { id: newRoom.id, ownerID: newRoom.ownerID, readByAdmin: newRoom.readByAdmin }]
            }));
        };
        const handleNewMessage = (messageObj: models.RoomEntity.Message) => {
            setRoomsState(prevState => {
                if(messageObj.roomID !== prevState.currentRoom) {
                    return {
                        ...prevState,
                        rooms: prevState.rooms.map(room => room.id === messageObj.roomID ? {...room, readByAdmin: false} : room)
                    };
                }
                return prevState;
            });
        }

        socket.on(`new-message-in-room`, handleNewMessage)
        socket.on('room-created', handleRoomCreated);
        return () => {
            socket.off('room-created', handleRoomCreated);
            socket.off(`new-message-in-room`, handleNewMessage)
        }
        // eslint-disable-next-line
    }, [])

    return (
        <div className={styles.chatAdmin}>
            <div className={styles.chatHeader}>Чат с клиентами</div>
            <div className={styles.content}>
                {
                    roomsState.currentRoom ? 
                        <Chat roomID={roomsState.currentRoom} adminLeaveRoom={setRoomsState}/> : 
                        <ul className={styles.rooms}> 
                            {
                                roomsState.rooms.map(room => {        
                                    return (
                                        <Room  key={room.id} id={room.id} ownerID={room.ownerID} readByAdmin={room.readByAdmin} setCurrentRoom={setRoomsState}/>
                                    )
                                })
                            }
                        </ul>
                }
            </div>
        </div>
    )
}

type RoomProps = {
    id: string,
    ownerID: string
    readByAdmin: boolean,
    setCurrentRoom: React.Dispatch<React.SetStateAction<RoomsInterface>>
}

function Room ({id, ownerID, readByAdmin, setCurrentRoom} : RoomProps) {
    const socket = useContext(SocketContext)
    const [userHolder, setUserHolder] = useState<{name: string, email: string, online: boolean} | null> (null)
    const authContext = useAuthContext()

    useEffect(() => {
        async function fetchOwnerAndRoomState(ownerID: string) {
            try {
                if(ownerID.includes("-")) {
                    socket.emit('get-room-users-online', id, (status: {online: number}) => {
                        if(status.online > 0) {
                            setUserHolder({name: "Анонимный пользователь", email: 'noemail@example.com', online: true})
                        } else {
                            setUserHolder({name: "Анонимный пользователь", email: 'noemail@example.com', online: false})
                        }
                    })
                } else {
                    const user = await UserService.getUserById(ownerID)
                    socket.emit('get-room-users-online', id, (status: {online: number}) => {
                        if(status.online > 0) {
                            setUserHolder({name: user.fullName, email: user.email, online: true})
                        } else {
                            setUserHolder({name: user.fullName, email: user.email, online: false})
                        }
                    })
                }
            } catch (error) {
                console.log("Something went wrong")
            }
        }
        fetchOwnerAndRoomState(ownerID)

        const handleDisconnection = () => setUserHolder((prevUser) => ({...prevUser!, online: false}))
        const handleConnection = () => setUserHolder((prevUser) => ({...prevUser!, online: true}))

        socket.on(`user-joined-chat-${id}`, handleConnection)
        socket.on(`user-disjoined-chat-${id}`, handleDisconnection)
        return () => {
            socket.off(`user-disjoined-chat-${id}`, handleDisconnection)
            socket.off(`user-joined-chat-${id}`, handleConnection)
        }
    }, [id, readByAdmin])

    const handleCurrentRoom = () => {
        if(!readByAdmin) {
            socket.emit('room-read-try', id, authContext.authState.user, (status: {ok: boolean, error: string | null}) => {
                if(status.ok) {
                    setCurrentRoom(prevState => ({
                        ...prevState,
                        currentRoom: id,
                        rooms: prevState.rooms.map(room => room.id === id ? {...room, readByAdmin: true} : room)
                    }))
                } else {
                    console.log("Unexpected error occured")
                }
            })
        } else {
            setCurrentRoom(prevState => ({
                ...prevState,
                currentRoom: id,
                rooms: prevState.rooms.map(room => room.id === id ? {...room, readByAdmin: true} : room)
            }))
        }  
    }

    return (
        <li onClick={handleCurrentRoom} className={styles.room}>
            <div className={styles.userImage}>
                <img src={process.env.PUBLIC_URL + "/images/user.png"} alt="" />
                <span className={userHolder?.online ? styles.online : styles.offline}></span>
            </div>
            <div className={styles.userData}>
                <div className={styles.userName}>{userHolder?userHolder.name:'...'}</div>
                <div className={styles.userEmail}>{userHolder?userHolder.email:'...'}</div>
            </div>
            {!readByAdmin && <div className={styles.newMessage}></div>}
        </li>
    )
}