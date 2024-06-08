import React, { useEffect, useState } from 'react'
import styles from "../../styles/pages/Home.module.scss"
import chatStyles from "../../styles/components/Chat.module.scss"
import { useAuthContext } from '../../contexts/AuthProvider'
import Chat from './Chat'
import ChatService from '../../services/chat-services'
import { RoomEntity } from "../../global";
import { useSocketContext } from '../../contexts/SocketProvider'

type Props = {}
function formatTime(hours: number, minutes: number): string {
    const formattedHours = String(hours).padStart(2, '0');
    const formattedMinutes = String(minutes).padStart(2, '0');
    return `${formattedHours}:${formattedMinutes}`;
}

function ChatClient(props: Props) {
    const socketContext = useSocketContext()
    const [currentRoom, setCurrentRoom] = useState<RoomEntity.IRoom | null>(null)
    const [messageText, setMessageText] = useState<string>("")
    const authContext = useAuthContext()

    useEffect(() => {
        async function getRoom() {
            try {
                if(authContext!.authState.user) {
                    const room = await ChatService.getMyRoom()
                    setCurrentRoom(room)
                } else {
                    const roomID = sessionStorage.getItem('roomID')
                    if(roomID) {
                        const room = await ChatService.getRoomById(roomID)
                        setCurrentRoom(room)
                    }
                }
            } catch (error) {

            }   
        
        }
        getRoom()
        // eslint-disable-next-line
    }, [])

    const handleMessageTextSet = (event: React.ChangeEvent<HTMLInputElement>) => {
        setMessageText(event.target.value)
    };

    const handleMessageSend = async () => {
        try {
            if(messageText) {
                const messageObj: RoomEntity.Message = {
                    roomID: undefined,
                    senderID: authContext!.authState.user ? authContext!.authState.user._id : undefined,
                    content: {
                        text: messageText,
                        time: formatTime(new Date().getHours(), new Date().getMinutes())
                    }
                }

                socketContext!.socket.emit("create-room-try", messageObj, async (status: {ok: boolean, roomID: string, error: string | null}) => {
                    if (status.ok) {
                        console.log(status)
                        const room = await ChatService.getRoomById(status.roomID)
                        sessionStorage.setItem("roomID", status.roomID)
                        setCurrentRoom(room)
                    } else {
                        console.error('Failed to send message:', status.error);
                    }
                })
            }
        } catch (error) {
            // console.log(error)
        }
    }

    const handleMessageSendOnKey = (event: React.KeyboardEvent) => {
        if (event.key === 'Enter') {
            handleMessageSend();
        }
    };

    return (
        <>
            <div className={`${styles.chatHeader}`}>Чат с администратором</div>
            { currentRoom ? 
                <Chat room={currentRoom}/> :
                <div className={chatStyles.room1}> 
                    <div className={chatStyles.advice}><span>Начните переписку с администротором!</span></div>
                    <div className={chatStyles.field}>
                        <input
                            type="text"
                            placeholder="Введите сообщение..."
                            value={messageText}
                            onChange={handleMessageTextSet}
                            onKeyUp={handleMessageSendOnKey}
                        />
                        <div className={chatStyles.actions}>
                            <img onClick={handleMessageSend} src={process.env.PUBLIC_URL + '/images/send.png'} alt="send"/>
                        </div>
                    </div>
                </div>
            }
        </>
    )
}

export default ChatClient