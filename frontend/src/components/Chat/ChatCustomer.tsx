import React, { useContext, useEffect, useState, useSyncExternalStore } from 'react'
import { SocketContext } from '../../contexts/SocketProvider'
import { useAuthContext } from '../../contexts/AuthProvider'
import Room from './Room'
import { roomStore } from '../../data/rooms/roomStore'
import { iroom } from 'room'

type Props = {}

export default function ChatCustomer({}: Props) {
    const authContext = useAuthContext()
    const socket = useContext(SocketContext)
    const room = useSyncExternalStore(roomStore.subscribe.bind(roomStore), roomStore.getSnapshot.bind(roomStore));
    useEffect(() => {
        async function getRoom() {
            try {
                if('email' in authContext.user!) {
                    if(!room || room.ownerID !== authContext.user!.id) {
                        console.log("Room UpLoaded!")
                        await roomStore.loadRoom()
                    }
                } else {
                    const roomID = localStorage.getItem('roomID')
                    if(roomID) {
                        if(!room || room.ownerID !== authContext.user!.id) {
                            console.log("Room UpLoaded!")
                            await roomStore.loadRoomById(roomID)
                        }
                    }
                }
            } catch (error: any) {
                
            }
        }
        
        getRoom()
    }, [authContext.user])
    return (
        <>
            { <Room room={room}/> }
        </>
    )
}