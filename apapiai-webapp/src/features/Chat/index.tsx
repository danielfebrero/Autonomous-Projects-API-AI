import { v4 as uuidv4 } from "uuid"

import useRedux from "../../hooks/useRedux"
import { setChatTextInput, addMessage } from "../../reducers/chat"
import { ChatMessage as ChatMessageType } from "../../reducers/chat/types"
import ChatMessage from "../../components/ChatMessage"

import "./style.scss"

const Chat: React.FC = () => {
  const { useAppDispatch, useAppSelector } = useRedux()
  const dispatch = useAppDispatch()
  const { chatTextInput, currentConversation } = useAppSelector(
    (state) => state.chat
  )
  const user = useAppSelector((state) => state.user)

  const buildChatMessage = (textInput: string): ChatMessageType => {
    return {
      id: uuidv4(),
      content: textInput,
      sender: user.clientId,
      timestamp: Date.now(),
    }
  }

  const sendMessage = (obj: any) => {
    obj.preventDefault()
    dispatch(addMessage({ message: buildChatMessage(chatTextInput), user }))
    dispatch(setChatTextInput(""))
  }

  return (
    <>
      <h2>Chat</h2>
      <div id="chat-container">
        <div id="chat-messages">
          {currentConversation?.messages.map((message) => {
            return (
              <ChatMessage
                key={message.id}
                message={message.content}
                senderIsLocalUser={message.sender === user.clientId}
                senderName={""}
                senderId={message.sender}
              />
            )
          })}
        </div>
        <form id="chat-form">
          <input
            id="chat-msg"
            type="text"
            placeholder="Enter Message"
            required
            value={chatTextInput}
            onChange={(e) => dispatch(setChatTextInput(e.target.value))}
            disabled={user.clientId === undefined}
          />
          <button
            id="chat-submit"
            onClick={sendMessage}
            disabled={user.clientId === undefined}
          >
            Send
          </button>
        </form>
      </div>
    </>
  )
}

export default Chat
