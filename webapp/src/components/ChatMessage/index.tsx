import Markdown from "react-markdown"

import { MessageTypes } from "../../reducers/chat/types"

import "./style.scss"

type ChatMessageProps = {
  message: {
    type: MessageTypes
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
  console.log({ message })
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

      {(message.type === "link" || message.type === "markdown") && (
        <div className="message-text">
          <Markdown>{message.value}</Markdown>
        </div>
      )}

      {message.type === "image" && (
        <div className="message-text">
          <img
            className="message-image"
            src={`data:image/png;base64, ${message.value}`}
            alt="Received from chat"
          />
        </div>
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
