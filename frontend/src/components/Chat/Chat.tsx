import React, {useCallback, useContext, useEffect, useRef, useState} from 'react';
import styles from "../../styles/components/Chat.module.scss"
import { useAuthContext } from '../../contexts/AuthProvider';
import { models } from '../../types/models';
import ChatService from '../../services/chat-services';
import { SocketContext } from '../../contexts/SocketProvider';
import { RoomsInterface } from './ChatAdmin';

function formatTime(hours: number, minutes: number): string {
    const formattedHours = String(hours).padStart(2, '0');
    const formattedMinutes = String(minutes).padStart(2, '0');
    return `${formattedHours}:${formattedMinutes}`;
}

type Props = {
    roomID: string | null,
    userInitiateRoom?: React.Dispatch<React.SetStateAction<string | null>> //client-side
    adminLeaveRoom?: React.Dispatch<React.SetStateAction<RoomsInterface>> //admin-side
}

interface RoomState {
    room: models.RoomEntity.IRoom | null, 
    companion: {name: string, email: string, online: boolean | undefined}
    message: string
}

const Chat = ({roomID, userInitiateRoom, adminLeaveRoom}: Props) => {
    const [roomState, updateRoomState] = useState<RoomState>({
        room: null,
        companion: {name: "Администратор", email: "intermobi@yahoo.com", online: undefined},
        message: ""
    })
    const authContext = useAuthContext()
    const socket = useContext(SocketContext)

    const messagesBlockRef = useRef<HTMLDivElement>(null);
    const fileUploaderRef = useRef<HTMLInputElement>(null)
    const currentRoomRef = useRef<models.RoomEntity.IRoom | null>(null as unknown as models.RoomEntity.IRoom);

    useEffect(() => {
        const fetchRoom = async () => {
            try {
                if(roomID) {
                    const room = await ChatService.getRoomById(roomID)
                    socket.emit("join-room", room.id, authContext.authState.user, (status: {ok: boolean}) => {
                        if(status.ok) {
                            socket.emit('get-companion-data', roomID, authContext.authState.user, (status: {ok: boolean}, companion: {name: string, email: string, online: boolean}) => {
                                if(status.ok) {
                                    updateRoomState({
                                        room: room,
                                        companion: companion,
                                        message: ""
                                    })
                                }
                            })
                        }
                    })
                }
            } catch (error) {
                alert("Комната не найдена")
            }
        }
        fetchRoom()

        const handleCompanionJoin = () => updateRoomState((prevRoom) => (
            {
                ...prevRoom, 
                room: {
                    ...prevRoom.room!, 
                    readByAdmin: authContext.authState.user.role === models.UserEntity.Auth.Role.CUSTOMER ? true : prevRoom.room!.readByAdmin,
                    readByUser : authContext.authState.user.role === models.UserEntity.Auth.Role.ADMIN ? true : prevRoom.room!.readByUser,
                }, 
                companion: {...prevRoom.companion!, online: true}
            }))
        const handleCompanionDisJoin = () => updateRoomState((prevRoom) => ({...prevRoom, companion: {...prevRoom.companion!, online: false}}))
        socket.on(`companion-joined-chat-${roomID}`, handleCompanionJoin)
        socket.on(`companion-disjoined-chat-${roomID}`, handleCompanionDisJoin)
        socket.on(`new-message-${roomID}`, handleMessageReceive)

        window.onbeforeunload = () => {
            if(currentRoomRef.current) {
                socket.emit('leave-room', currentRoomRef.current.id, authContext.authState.user)
            }
        }

        return () => {
            socket.emit('leave-room', roomID, authContext.authState.user)
            window.onbeforeunload = null
            socket.off(`new-message-${roomID}`, handleMessageReceive)
            socket.off(`companion-joined-chat-${roomID}`, handleCompanionJoin)
            socket.off(`companion-disjoined-chat-${roomID}`, handleCompanionDisJoin)
        }   
    }, [roomID, authContext.authState.authorized])
    useEffect(() => {
        currentRoomRef.current = roomState.room
    }, [roomState.room])
    useEffect(() => {
        if(messagesBlockRef.current) {
            messagesBlockRef.current.scrollTop = messagesBlockRef.current.scrollHeight;
        }
    }, [roomState.room?.messages.length, roomState.room?.messages.length])



    const handleMessageSet = (event: React.ChangeEvent<HTMLInputElement>) => {
        updateRoomState((prevRoom) => ({...prevRoom, message: event.target.value}))
    };

    const handleMessageSend = async () => {
        try {
            if(roomState.message) {
                const messageObj: models.RoomEntity.Message = {
                    roomID: roomState.room? roomState.room.id : undefined,
                    senderID: authContext.authState.user.id,
                    content: {
                        text: roomState.message,
                        time: formatTime(new Date().getHours(), new Date().getMinutes())
                    }
                }

                if(roomState.room) {
                    socket.emit("message-send-try", messageObj, async (status: {ok: boolean, error: string | null}) => {
                        if (status.ok) {
                            updateRoomState((prevRoomState) => ({
                                ...prevRoomState, 
                                room: { 
                                    ...prevRoomState.room!, 
                                    [authContext.authState.user.role === models.UserEntity.Auth.Role.ADMIN ? 'readByUser' : 'readByAdmin']: prevRoomState.companion.online ? true : false,
                                    messages: [...prevRoomState.room!.messages, messageObj]
                                },
                                message: ""
                            }))
                        } else {
                            throw new Error(`Failed to send message: ${status.error}`)
                        }
                    })
                } else {
                    socket.emit("create-room-try", messageObj, async (status: {ok: boolean, roomID: string, error: string | null}) => {
                        if (status.ok) {
                            const room = await ChatService.getRoomById(status.roomID)
                            socket.emit("join-room", room.id, authContext.authState.user, (status: {ok: boolean}) => {
                                if(status.ok) {
                                    if(!authContext.authState.authorized) {
                                        localStorage.setItem("roomID", room.id)
                                    }
                                    userInitiateRoom!(room.id)
                                }
                            })
                        } else {
                            throw new Error(`Failed to send message: ${status.error}`)
                        }
                    })
                }
            }
        } catch (error) {
            console.log(error)
        }
    }
    const handleMessageSendOnKey = (event: React.KeyboardEvent) => {
        if (event.key === 'Enter') {
            handleMessageSend();
        }
    };

    const handleMessageReceive = (messageObj: models.RoomEntity.Message) => {
        updateRoomState((prevRoomState) => ({
            ...prevRoomState, 
            room: { 
                ...prevRoomState.room!, 
                [authContext.authState.user.role === models.UserEntity.Auth.Role.ADMIN ? 'readByUser' : 'readByAdmin']: prevRoomState.companion.online ? true : false,
                messages: [...prevRoomState.room!.messages, messageObj]
            },
            message: ""
        }))
    };

    const handleFileChoose = () => {
        fileUploaderRef.current?.click()
    }
    const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const formData = new FormData();
        if(event.target) {
            let files
            if(event.target.files) {
                files = Array.from(event.target.files)
                for (let index = 0; index < files.length; index++) {
                    formData.append("images/", files[index]);           
                }
            }
        }
    }

    const handleExitRoom = () => {
        adminLeaveRoom!((prevState) => ({
            ...prevState,
            currentRoom: ""
        }))
    }

    return (
        <div className={styles.chat}>
            <div className={styles.companion}>
                {
                    authContext.authState.user.role === models.UserEntity.Auth.Role.CUSTOMER?
                    <div className={styles.logo}>
                        <img src={process.env.PUBLIC_URL + '/images/logo1.png'} alt="admin-logo"/>
                        <span className={typeof roomState.companion?.online === "undefined" ? styles.undefined : (roomState.companion?.online ? styles.online : styles.offline)}></span>
                    </div>
                    :
                    <div className={styles.logo}>
                        <img src={process.env.PUBLIC_URL + '/images/user.png'} alt="admin-logo"/>
                        <span className={roomState.companion?.online ? styles.online : styles.offline}></span>
                    </div>
                }
                <div className={styles.companionData}>
                    <div className={styles.name}>{roomState.companion?.name}</div>
                    <div className={styles.email}>{roomState.companion?.email}</div>
                </div>
                {
                    authContext.authState.user.role === models.UserEntity.Auth.Role.CUSTOMER && authContext.authState.user.id.includes("-") ? 
                    <div className={styles.warning}>
                        <img src={process.env.PUBLIC_URL + '/images/warning.png'} alt="" />
                        <p>Временный чат</p>
                    </div> 
                    :
                    authContext.authState.user.role === models.UserEntity.Auth.Role.ADMIN && <div className={styles.exit} onClick={handleExitRoom}><img src={process.env.PUBLIC_URL + '/images/exit.png'} alt="" /></div>
                }
            </div>
            <div ref={messagesBlockRef} className={styles.messages}>
                {
                    roomState?.room?.messages.map((message: models.RoomEntity.Message, key: number) => {
                        return (
                            message.senderID === authContext.authState.user.id ?
                            <div key = {key} className={`${styles.message} ${styles.me}`}>
                                <span className={`${styles.time}`}>{message.content.time}</span>
                                <span className={`${styles.text}`}>{message.content.text}</span>
                                {
                                    authContext.authState.user.role === models.UserEntity.Auth.Role.CUSTOMER ?
                                    <img src={process.env.PUBLIC_URL + '/images/user.png'} alt="user-logo" className={`${styles.logo}`}/>
                                    :
                                    <img src={process.env.PUBLIC_URL + '/images/logo1.png'} alt="admin-logo" className={`${styles.logo}`}/>
                                }
                            </div>
                            :
                            <div key = {key} className={`${styles.message} ${styles.other}`}>
                                {
                                    authContext.authState.user.role === models.UserEntity.Auth.Role.CUSTOMER ?
                                    <img src={process.env.PUBLIC_URL + '/images/logo1.png'} alt="admin-logo" className={`${styles.logo}`}/>
                                    :
                                    <img src={process.env.PUBLIC_URL + '/images/user.png'} alt="user-logo" className={`${styles.logo}`}/>
                                }
                                <span className={`${styles.text}`}>{message.content.text}</span>
                                <span className={`${styles.time}`}>{message.content.time}</span>
                            </div>
                        )
                    })
                }
                <div className={styles.read}>
                    {
                        authContext.authState.user.role === models.UserEntity.Auth.Role.ADMIN ?
                        <>{roomState.room?.readByUser && roomState.room!.messages[roomState.room?.messages.length - 1].senderID === authContext.authState.user.id ? "Прочитано" : ""}</>
                        :
                        <>{roomState.room?.readByAdmin && roomState.room!.messages[roomState.room?.messages.length - 1].senderID === authContext.authState.user.id ? "Прочитано" : ""}</>
                    }
                </div>
            </div>
            <div className={styles.field}>
                <input
                    type="text"
                    placeholder="Введите сообщение..."
                    value={roomState?.message}
                    onChange={handleMessageSet}
                    onKeyDown={handleMessageSendOnKey}
                />
                <div className={styles.actions}>
                    <input onChange={handleFileUpload} ref={fileUploaderRef} type="file" multiple accept="image/*" name="fileInput" id="fileInput" style={{display: 'none'}}/>
                    <img onClick={handleFileChoose} src={process.env.PUBLIC_URL + '/images/attach.png'} alt="attach"/>
                    <img onClick={handleMessageSend} src={process.env.PUBLIC_URL + '/images/send.png'} alt="send"/>
                </div>
            </div>
        </div>
    );
}

export default Chat