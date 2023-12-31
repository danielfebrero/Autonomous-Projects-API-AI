import { useEffect } from "react"

import useRedux from "../../hooks/useRedux"
import useSocket from "../../hooks/useSocket"
import {
  setChatTextInput,
  addMessage,
  replaceOrAddMessage,
} from "../../reducers/chat"
import ChatMessage from "../../components/ChatMessage"
import {
  buildChatMessage,
  sendMessageToServer,
  buildMessageFromText,
  scrollToBottom,
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
    if (t.responseUuid) {
      dispatch(
        replaceOrAddMessage({
          message: buildChatMessage(t),
          user: undefined,
          responseUuid: t.responseUuid,
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
    setTimeout(() => scrollToBottom(), 1000)
  }

  const sendMessage = async (obj: any) => {
    const message = buildChatMessage(buildMessageFromText(chatTextInput), user)
    obj.preventDefault()
    dispatch(addMessage({ message, user }))
    dispatch(setChatTextInput(""))
    scrollToBottom()

    const res = await sendMessageToServer({
      message: message.content.value,
      user,
      conversationID: chat.currentConversation?.conversationID,
      socketUuid,
    })

    if (res && res.content) receivedMessageFromServer(res)
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
          <textarea
            id="chat-msg"
            placeholder="Enter Message"
            required
            value={chatTextInput}
            onChange={(e) => dispatch(setChatTextInput(e.target.value))}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                sendMessage(e)
              }
            }}
            disabled={user.clientId === undefined}
            rows={Math.min(
              Math.max(2, (chatTextInput.match(/\n/g) || []).length),
              8
            )}
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
