import { createContext, useContext, useEffect, useState } from 'react';
import { Socket, io } from 'socket.io-client';
import { useAuthContext } from './AuthProvider';
export const URL = process.env.REACT_APP_API_URL || `https://localhost:443`;

interface SocketContextInterface {
    socket: Socket
    updateSocket: React.Dispatch<React.SetStateAction<Socket>>
}
const SocketContext = createContext<SocketContextInterface | undefined>(undefined)
export const useSocketContext = () => useContext(SocketContext);


function SocketProvider({children} : React.PropsWithChildren) {
    const authContext = useAuthContext()
    const [socket, updateSocket] = useState(io(URL, {
        autoConnect: false,
        withCredentials: true,
        extraHeaders: {
            authorization: localStorage.getItem("token") || ""
        }
    }))
    useEffect(() => {
        updateSocket(io(URL, {
            autoConnect: false,
            withCredentials: true,
            extraHeaders: {
                authorization: localStorage.getItem("token") || ""
            }
        }))
        // eslint-disable-next-line
    }, [authContext!.authState.user])
  return (
    <SocketContext.Provider value={{socket, updateSocket}}>
        {children}
    </SocketContext.Provider>
  )
}

export default SocketProvider