import "./style.scss"

const Chat: React.FC = () => {
  return (
    <div>
      <h2>Chat</h2>
      <div id="chat-container">
        <div id="chat-messages" />
        <form id="chat-form">
          <input id="msg" type="text" placeholder="Enter Message" required />
          <button type="submit">Send</button>
        </form>
      </div>
    </div>
  )
}

export default Chat
