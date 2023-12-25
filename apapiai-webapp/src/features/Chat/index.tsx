import useRedux from "../../hooks/useRedux"
import { setChatTextInput } from "../../reducers/chat"

import "./style.scss"

const Chat: React.FC = () => {
  const { useAppDispatch, useAppSelector } = useRedux()
  const dispatch = useAppDispatch()
  const { chatTextInput } = useAppSelector((state) => state.chat)

  const sendMessage = (obj: any) => {
    obj.preventDefault()
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
