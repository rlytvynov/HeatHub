import React, {useEffect, useRef, useState} from 'react';
import styles from "../../styles/components/Chat.module.scss"
import { useAuthContext } from '../../contexts/AuthProvider';
import { socket } from '../../utils/socket';
import { RoomEntity } from "../../global";

function formatTime(hours: number, minutes: number): string {
    const formattedHours = String(hours).padStart(2, '0');
    const formattedMinutes = String(minutes).padStart(2, '0');
    return `${formattedHours}:${formattedMinutes}`;
}

type Props = {
    room: RoomEntity.IRoom
}

const Chat = ({room}: Props) => {
    const authContext = useAuthContext()
    const messagesBlockRef = useRef<HTMLDivElement>(null);
    const fileUploaderRef = useRef<HTMLInputElement>(null)
    const [messageText, setMessageText] = useState("")
    const [currentRoom, setCurrentRoom] = useState<RoomEntity.IRoom>(room);

    const handleMessageSet = (event: React.ChangeEvent<HTMLInputElement>) => {
        setMessageText(event.target.value)
    };

    const handleMessageSend = async () => {
        try {
            if(messageText) {
                const messageObj: RoomEntity.Message = {
                    roomID: currentRoom._id,
                    senderID: authContext!.authState.user ? authContext!.authState.user._id : undefined,
                    content: {
                        text: messageText,
                        time: formatTime(new Date().getHours(), new Date().getMinutes())
                    }
                }
                socket.emit("message-send-try", messageObj, async (status: {ok: boolean, error: string | null}) => {
                    if (status.ok) {
                        setCurrentRoom(oldRoom => ({
                            ...oldRoom,
                            messages: [...oldRoom.messages, messageObj]
                        }))
                        setMessageText("")
                    } else {
                        console.error('Failed to send message:', status.error);
                        setMessageText("")
                    }
                })
            }
        } catch (error) {
            console.log(error)
        }
    }
    
    useEffect(() => {
        const handleMessageReceive = (messageObj: RoomEntity.Message) => {
            if(messageObj.roomID === room._id) {
                setCurrentRoom(oldRoom => ({
                    ...oldRoom,
                    messages: [...oldRoom.messages, messageObj]
                }));
            }   
        };

        socket.on("message-receive", handleMessageReceive)
        return () => {
            socket.off("message-receive", handleMessageReceive)
        }
    }, [room])

    useEffect(() => {
        if(messagesBlockRef.current) {
            messagesBlockRef.current.scrollTop = messagesBlockRef.current.scrollHeight;
        }
    }, [room.messages.length, currentRoom.messages.length])

    const handleMessageSendOnKey = (event: React.KeyboardEvent) => {
        if (event.key === 'Enter') {
            handleMessageSend();
        }
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

    return (
        <div className={`${styles.room}`}>
            <div className={styles.header}>
                {
                    (authContext!.authState.user && authContext!.authState.user.role === "CUSTOMER") || !authContext!.authState.user ?
                    <div className={styles.logo}>
                        <img src={process.env.PUBLIC_URL + '/images/logo1.png'} alt="admin-logo"/>
                        <div className={styles.online}></div>
                    </div>
                    :
                    <div className={styles.logo}>
                        <img src={process.env.PUBLIC_URL + '/images/user.png'} alt="admin-logo"/>
                        <div className={styles.online}></div>
                    </div>
                }
                <div className={styles.names}>
                    <div className={styles.name}>Администратор</div>
                    <div className={styles.email}>intermobi@yahoo.com</div>
                </div>
                <img id={styles.drop} src={process.env.PUBLIC_URL + '/images/trash.png'} alt="trash"/>
            </div>
            <div className={styles.wrapperChat}>
                <div ref={messagesBlockRef} className={`${styles.messages}`}>
                    {
                        currentRoom?.messages.map((message: RoomEntity.Message, key: number) => {
                            return (
                                (message.senderID === null && !authContext!.authState.user) || message.senderID === authContext!.authState.user!._id?
                                <div key = {key} className={`${styles.message} ${styles.me}`}>
                                    <span className={`${styles.time}`}>{message.content.time}</span>
                                    <span className={`${styles.text}`}>{message.content.text}</span>
                                    {
                                        !authContext!.authState.user || authContext!.authState.user.role === "CUSTOMER" ?
                                        <img src={process.env.PUBLIC_URL + '/images/user.png'} alt="user-logo" className={`${styles.logo}`}/>
                                        :
                                        <img src={process.env.PUBLIC_URL + '/images/logo1.png'} alt="admin-logo" className={`${styles.logo}`}/>
                                    }
                                </div>
                                :
                                <div key = {key} className={`${styles.message} ${styles.other}`}>
                                    {
                                        !authContext!.authState.user || authContext!.authState.user.role === "CUSTOMER" ?
                                        <img src={process.env.PUBLIC_URL + '/images/logo1.png'} alt="admin-logo" className={`${styles.logo}`}/>
                                        :
                                        <img src={process.env.PUBLIC_URL + '/images/user.png'} alt="user-logo" className={`${styles.logo}`}/>
                                    }
                                    <img src={process.env.PUBLIC_URL + '/images/logo1.png'} alt="admin-logo" className={`${styles.logo}`}/>
                                    <span className={`${styles.text}`}>{message.content.text}</span>
                                    <span className={`${styles.time}`}>{message.content.time}</span>
                                </div>
                            )
                        })
                    }
                </div>
            </div>
            <div className={`${styles.field}`}>
                <input
                    type="text"
                    placeholder="Введите сообщение..."
                    value={messageText}
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