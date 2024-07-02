type Props = {
    users: number
}

export default function OnlineUsers({users}: Props) {
    return (
        <fieldset style={{position: 'absolute', top: 0, right: 0, width: 'fit-content', padding: '0.5rem'}}>
            <span>Online users: {users}</span>
        </fieldset>
    )
}