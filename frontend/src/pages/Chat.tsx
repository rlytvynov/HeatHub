import "../styles/pages/Chat.css"
import { useAuthContext } from "../contexts/AuthProvider"
import ChatAdmin from "../components/Chat/ChatAdmin"
import ChatCustomer from "../components/Chat/ChatCustomer"
type Props = {}

export default function Chat({}: Props) {
    const authContext = useAuthContext()
    return (
        <div className="window chat-wrapper">
            <div className="title-bar">
                <div className="title-bar-text">The Chat</div>
            </div>
                { authContext.user?.role === 'admin' && <ChatAdmin/> }
                { authContext.user?.role === 'customer' && <ChatCustomer/> }
        </div>
    )
}