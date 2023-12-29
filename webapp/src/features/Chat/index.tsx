import { useEffect } from "react"

import useRedux from "../../hooks/useRedux"
import useSocket from "../../hooks/useSocket"
import {
  setChatTextInput,
  addMessage,
  replaceMessage,
} from "../../reducers/chat"
import ChatMessage from "../../components/ChatMessage"
import {
  buildChatMessage,
  sendMessageToServer,
  buildMessageFromText,
} from "../../reducers/chat/utils"
import { ChatResponseFromServer } from "../../reducers/chat/types"

import "./style.scss"

const Chat: React.FC = () => {
  const { useAppDispatch, useAppSelector } = useRedux()
  const dispatch = useAppDispatch()
  const { chatTextInput, currentConversation } = useAppSelector(
    (state) => state.chat
  )
  const user = useAppSelector((state) => state.user)
  const chat = useAppSelector((state) => state.chat)

  const { isConnected, socketUuid, socket } = useSocket()

  const receivedMessageFromServer = (t: ChatResponseFromServer) => {
    console.log({ t })
    if (t.pendingTaskId) {
      dispatch(
        replaceMessage({
          message: buildChatMessage(t),
          user: undefined,
          pendingTaskId: t.pendingTaskId,
        })
      )
    } else {
      dispatch(
        addMessage({
          message: buildChatMessage(t),
          user: undefined,
        })
      )
    }
  }

  const sendMessage = async (obj: any) => {
    const message = buildChatMessage(buildMessageFromText(chatTextInput), user)
    obj.preventDefault()
    dispatch(addMessage({ message, user }))
    dispatch(setChatTextInput(""))

    const res = await sendMessageToServer({
      message: message.content.value,
      user,
      conversationID: chat.currentConversation?.conversationID,
      socketUuid,
    })

    if (res) receivedMessageFromServer(res)
  }

  useEffect(() => {
    if (isConnected) {
      console.log("connected", socketUuid)
      socket.on("message", receivedMessageFromServer)
    } else {
      console.log("disconnected")
    }
  }, [isConnected])

  return (
    <>
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
