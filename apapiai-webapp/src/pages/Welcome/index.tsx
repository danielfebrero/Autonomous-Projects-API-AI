import { useNavigate, useLocation } from "react-router-dom"

import GoogleSigninButton from "../../features/GoogleSigninButton"
import Chat from "../../features/Chat"

import "./style.scss"

const Welcome: React.FC = () => {
  const navigate = useNavigate()
  const location = useLocation()
  if (location.pathname !== "/") navigate("/")

  return (
    <div id="welcome-container">
      <h1>Welcome to apapiai</h1>
      <GoogleSigninButton />
      <Chat />
    </div>
  )
}

export default Welcome
