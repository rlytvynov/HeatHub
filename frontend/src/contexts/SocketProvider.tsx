import { createContext, useEffect, useRef, useState } from 'react';
import { Socket, io } from 'socket.io-client';
import { useAuthContext } from './AuthProvider';


export const URL = process.env.REACT_APP_API_URL || `http://localhost:80`;
export const SocketContext = createContext(null as unknown as Socket)

function SocketProvider({children} : React.PropsWithChildren) {
    const authContext = useAuthContext()
    const socket = useRef<Socket>(null as unknown as Socket)
    const [connected, setConnected] = useState<boolean>(false)

    useEffect(() => {
        socket.current = io(URL, {
            extraHeaders: {
                authorization: localStorage.getItem("token") || ""
            },
            query: {
                "id": localStorage.getItem("default_id") || "",
                "role": "customer"
            }
        })
    
        socket.current.on('connect', () => {
            console.info(`Connected ${authContext.user?.id}`)
            setConnected(true)
        })

        socket.current.on('connect_error', (error: any) => {
            console.error(error.message)
            setConnected(false)
        });

        socket.current.on('disconnect', (reason: string) => {
            console.info(`Disconnected ${authContext.user?.id}`)
            setConnected(false)
        })
        socket.current.on('error', err => {
            console.error('Socket Error:', err.message)
        })
    
        return () => {
            if (socket.current && socket.current.connected) {
                socket.current.disconnect()
            }
        }
    }, [authContext.user?.id])
    
    return (
        <>
            {
                socket.current && connected &&
                <SocketContext.Provider value={socket.current}>
                    {children}
                </SocketContext.Provider>
            }
        </>
    )
}

export default SocketProvider