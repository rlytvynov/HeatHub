import { useContext, useEffect, useState } from 'react'
import styles from "../../styles/components/Chat.module.scss"
import { AuthActionType, useAuthContext } from '../../contexts/AuthProvider'
import Chat from './Chat'
import ChatService from '../../services/chat-services'
import { SocketContext } from '../../contexts/SocketProvider'
import authHandler from '../../utils/authHandler'

function ChatClient() {
    const [currentRoom, setCurrentRoom] = useState<string | null>(null)
    const authContext = useAuthContext()
    const socket = useContext(SocketContext)

    useEffect(() => {
        async function getRoom() {
            try {
                if(authContext.authState.authorized) {
                    const room = await ChatService.getMyRoom()
                    setCurrentRoom(room.id)
                } else {
                    const roomID = localStorage.getItem('roomID')
                    if(roomID) {
                        setCurrentRoom(roomID)
                    } else {
                        setCurrentRoom(null)
                    }
                }
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
        getRoom()
        // eslint-disable-next-line
    }, [authContext.authState.authorized])


    return (
        <div className={styles.chatClient}>
            <div className={styles.chatHeader}>Чат с администратором</div>
            <div className={styles.content}>
                {
                    currentRoom ? 
                        <Chat roomID={currentRoom}/>
                        :
                        <Chat roomID={null} userInitiateRoom = {setCurrentRoom}/>
                }
            </div>
        </div>
    )
}

export default ChatClient