import "./style.scss"

type ChatMessageProps = {
  message: string
  senderIsLocalUser: boolean
  senderName: string
  senderId?: string
}

const ChatMessage: React.FC<ChatMessageProps> = ({
  message,
  senderIsLocalUser,
  senderName,
}) => {
  return (
    <div
      className={`chat-message ${
        senderIsLocalUser ? "local-user" : "remote-user"
      }`}
    >
      {!senderIsLocalUser && <div className="sender-name">{senderName}</div>}
      <div className="message-text">{message}</div>
    </div>
  )
}

export default ChatMessage
