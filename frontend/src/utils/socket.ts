import { io } from 'socket.io-client';
const URL = process.env.REACT_APP_API_URL || `https://localhost:443`;

export const socket = io(URL, {
    autoConnect: false,
    withCredentials: true,
    extraHeaders: {
        authorization: localStorage.getItem("token") || ""
    }
});