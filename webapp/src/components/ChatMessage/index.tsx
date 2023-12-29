import "./style.scss"

type ChatMessageProps = {
  message: {
    type: "text" | "image" | "json" | "pending"
    value: string
  }
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

      {message.type === "text" && (
        <div className="message-text">{message.value}</div>
      )}

      {message.type === "json" && (
        <div className="message-text">
          {<pre>{JSON.stringify(JSON.parse(message.value), null, 2)}</pre>}
        </div>
      )}

      {message.type === "pending" && (
        <div className="message-text">
          <div className="loader" id={"pending_" + message.value}></div>
        </div>
      )}
    </div>
  )
}

export default ChatMessage
