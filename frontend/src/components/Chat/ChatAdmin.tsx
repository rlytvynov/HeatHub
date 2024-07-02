import React, { SetStateAction, useEffect, useState, useSyncExternalStore } from 'react'
import Room from './Room'
import { iuserExtend } from 'user'
import UserService from '../../services/user-services'
import { adminRoomsStore } from '../../data/rooms/adminRoomsStore'
import { userSessionsStore } from '../../data/sessions/userSessionsStore'
import { iroom } from 'room'

type Props = {}

export default function ChatAdmin({}: Props) {
    const adminRooms = useSyncExternalStore(adminRoomsStore.subscribe.bind(adminRoomsStore), adminRoomsStore.getSnapshot.bind(adminRoomsStore));
    const [currentRoom, setCurrentRoom] = useState<iroom | null>(null)
    useEffect(() => {

    }, [adminRooms])
    return (
        <>
            {!currentRoom && <Rooms setRoom={setCurrentRoom}/>}
            {currentRoom && 
                <>
                    <Room room={currentRoom} setRoom = {setCurrentRoom}/>
                </>
            }
        </>
    )
}

type RoomsProps = {
    setRoom: React.Dispatch<SetStateAction<iroom | null>>
}

function Rooms({ setRoom }: RoomsProps) {
    const adminRooms = useSyncExternalStore(adminRoomsStore.subscribe.bind(adminRoomsStore), adminRoomsStore.getSnapshot.bind(adminRoomsStore));
    const userRooms = useSyncExternalStore(userSessionsStore.subscribe.bind(userSessionsStore), userSessionsStore.getSnapshot.bind(userSessionsStore));
    useEffect(() => {
        if(!adminRooms.length) {
            adminRoomsStore.loadRooms()
        }
    }, [adminRooms])
    const onClick = (room: iroom) => {
        setRoom(room)
    }
    return (
        <div className="window-body">
            <div className="chat-container">
            {
                adminRooms.length !== 0 &&
                adminRooms.map((room, index) => {
                    return (
                        <fieldset key={index} onClick={() => onClick(room)} style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.5rem'}} className="room-card">
                            <div style={{display: 'flex', flexDirection: 'column', gap: '0.5rem'}} className="holder-data">
                                <div> {room.id} </div>
                                <div style={{display: 'flex', gap: '1rem'}}>
                                    <span>{room.ownerID}</span>
                                    {userRooms.length !== 0 && userRooms.find((user) => user === room.ownerID) ?  <strong style={{color: 'green'}}> online</strong> : <strong style={{color: 'red'}}> offline</strong> }
                                </div>
                            </div>
                            {!room.readByAdmin && <fieldset style={{width: 'fit-content', padding: '0.5rem', margin: 0}}>new message</fieldset>}
                        </fieldset>
                    )
                })
            }
            </div>
        </div>
    )
}