import { useContext, useEffect, useState, useSyncExternalStore } from "react"
import send from "../../assets/send.png"
import attach from "../../assets/attached.png"
import "../../styles/components/Room.css"
import { roomStore } from "../../data/rooms/roomStore"
import { useAuthContext } from "../../contexts/AuthProvider"
import { SocketContext } from "../../contexts/SocketProvider"
import { iroom, message } from "room"
import { adminRoomsStore } from "../../data/rooms/adminRoomsStore"
import { userSessionsStore } from "../../data/sessions/userSessionsStore"
import { adminSessionsStore } from "../../data/sessions/adminSessionsStore"

type Props = {
    room: iroom | undefined
    setRoom?: React.Dispatch<React.SetStateAction<iroom | null>> 
}

export default function Room({room, setRoom}: Props) {
    const [message, setMessage] = useState('')
    const authContext = useAuthContext()
    const socket = useContext(SocketContext)
    useSyncExternalStore(roomStore.subscribe.bind(roomStore), roomStore.getSnapshot.bind(roomStore));
    useSyncExternalStore(adminRoomsStore.subscribe.bind(adminRoomsStore), adminRoomsStore.getSnapshot.bind(adminRoomsStore));
    useSyncExternalStore(adminSessionsStore.subscribe.bind(adminSessionsStore), adminSessionsStore.getSnapshot.bind(adminSessionsStore))
    useSyncExternalStore(userSessionsStore.subscribe.bind(userSessionsStore), userSessionsStore.getSnapshot.bind(userSessionsStore));
    useEffect(() => {
        const handleNewMessage = (refreshedRoom: iroom) => {
            console.log(refreshedRoom)
            if(authContext.user?.role === 'admin') {
                adminRoomsStore.refreshRoom(refreshedRoom)
                setRoom!(refreshedRoom)
            } else {
                roomStore.refreshRoom(refreshedRoom)
            }
        }
        if(room) {
            socket.emit("join-room", room.id, authContext.user!)
        }
        socket.on('new-message', handleNewMessage)
        return () => {
            socket.emit('leave-room', room?.id, authContext.user)
            socket.off('new-message', handleNewMessage)
        }
    }, [room, authContext.user])
    const sendMessage = () => {
        if(message) {
            const messageObj: message = {
                roomID: room ? room.id : undefined,
                    senderID: authContext.user!.id,
                    content: {
                        text: message,
                        time: new Date().toDateString()
                    }
            }
            socket.emit("send-message", messageObj, (refreshedRoom: iroom) => {
                if(authContext.user?.role === 'admin') {
                    adminRoomsStore.refreshRoom(refreshedRoom)
                    setRoom!(refreshedRoom)
                } else {
                    if(!('email' in authContext.user!) && !room) {
                        localStorage.setItem('roomID', refreshedRoom.id)
                    }
                    roomStore.refreshRoom(refreshedRoom)
                }
                setMessage('')
            })
        }
    }



    return (
        <>
            <div className="window-body">
                {authContext.user?.role === 'admin' && <button onClick={() => setRoom!(null)}>Leave</button>}
                <div className="chat-container">
                    <div className="message-wrapper">
                        {
                            room?.messages.map((message, index) => {
                                return (
                                    message.senderID === authContext.user?.id ?
                                    <div key={index} className="message my">
                                        <span>{message.content.time}</span>
                                        <fieldset>{message.content.text}</fieldset>
                                    </div>
                                    :
                                    <div key={index} className="message companion">
                                        <fieldset>{message.content.text}</fieldset>
                                        <span>{message.content.time}</span>
                                    </div>
                                )
                            })
                        }
                    </div>
                </div>
                <div className="input-message-block">
                    <input onKeyDown={(e) => e.key === 'Enter' && sendMessage()} value={message} onChange={(e) => setMessage(e.target.value)} type="text" name="massage" id="message" />
                    <div className="icons">
                        <img onClick={sendMessage} src={send} alt="send" />
                        <img src={attach} alt="send" />
                    </div>
                </div>
            </div>
            <div className="status-bar">
                <p className="status-bar-field">Companion: <strong>{authContext.user?.role === 'admin' ? room?.ownerID : 'Admin'}</strong></p>
                <p className="status-bar-field">Email: <strong style={{color: 'orange'}}>{authContext.user?.role === 'admin' ? '-' : 'intermobi@yahoo.com'}</strong></p>
                <p className="status-bar-field">Status: 
                    {   authContext.user?.role === 'admin' ? 
                        userSessionsStore.isUserOnline(room!.ownerID) ? <strong style={{color: 'green'}}> online</strong> : <strong style={{color: 'red'}}> offline</strong>
                        :
                        adminSessionsStore.isAdminOnline() ? <strong style={{color: 'green'}}> online</strong> : <strong style={{color: 'red'}}> offline</strong>
                    }
                </p>
            </div>
        </>

    )
}