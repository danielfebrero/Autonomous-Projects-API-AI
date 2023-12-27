import { v4 as uuidv4 } from "uuid"

import useRedux from "../../hooks/useRedux"
import { setChatTextInput, addMessage } from "../../reducers/chat"
import ChatMessage from "../../components/ChatMessage"
import {
  buildChatMessage,
  sendMessageToServer,
} from "../../reducers/chat/utils"

import "./style.scss"

const Chat: React.FC = () => {
  const { useAppDispatch, useAppSelector } = useRedux()
  const dispatch = useAppDispatch()
  const { chatTextInput, currentConversation } = useAppSelector(
    (state) => state.chat
  )
  const user = useAppSelector((state) => state.user)
  const chat = useAppSelector((state) => state.chat)

  const sendMessage = async (obj: any) => {
    const message = buildChatMessage(chatTextInput, user)
    obj.preventDefault()
    dispatch(addMessage({ message, user }))
    dispatch(setChatTextInput(""))

    // send message to server
    const messagesFromServer: any[] = []

    const res = await sendMessageToServer({
      message,
      user,
      conversationID: chat.currentConversation?.conversationID,
    })

    res.forEach((r) => {
      if (r.error) {
        console.log(r.error)
      } else {
        console.log({ r })
        r.text?.text?.forEach((t) => {
          dispatch(
            addMessage({
              message: buildChatMessage(t as unknown as string),
              user: undefined,
            })
          )
        })
      }
    })

    console.log(messagesFromServer)
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
