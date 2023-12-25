import "./style.scss"

const Chat: React.FC = () => {
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
          />
          <button id="chat-submit" type="submit">
            Send
          </button>
        </form>
      </div>
    </>
  )
}

export default Chat
