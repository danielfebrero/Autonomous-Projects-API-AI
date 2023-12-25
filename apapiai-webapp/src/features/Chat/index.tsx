import { v4 as uuidv4 } from "uuid"

import useRedux from "../../hooks/useRedux"
import { setChatTextInput, addMessage, ChatMessage } from "../../reducers/chat"

import "./style.scss"

const Chat: React.FC = () => {
  const { useAppDispatch, useAppSelector } = useRedux()
  const dispatch = useAppDispatch()
  const { chatTextInput } = useAppSelector((state) => state.chat)
  const { clientId } = useAppSelector((state) => state.user)

  const buildChatMessage = (textInput: string): ChatMessage => {
    return {
      id: uuidv4(),
      content: textInput,
      sender: clientId,
      timestamp: Date.now(),
    }
  }

  const sendMessage = (obj: any) => {
    obj.preventDefault()
    dispatch(addMessage(buildChatMessage(chatTextInput)))
    dispatch(setChatTextInput(""))
  }

  return (
    <>
      <h2>Chat</h2>
      <div id="chat-container">
        <div id="chat-messages" />
        <form id="chat-form">
          <input
            id="chat-msg"
            type="text"
            placeholder="Enter Message"
            required
            value={chatTextInput}
            onChange={(e) => dispatch(setChatTextInput(e.target.value))}
          />
          <button id="chat-submit" onClick={sendMessage}>
            Send
          </button>
        </form>
      </div>
    </>
  )
}

export default Chat
