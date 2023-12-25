import { useNavigate, useLocation } from "react-router-dom"

import GoogleSigninButton from "../../features/GoogleSigninButton"
import Chat from "../../features/Chat"

const Welcome: React.FC = () => {
  const navigate = useNavigate()
  const location = useLocation()
  if (location.pathname !== "/") navigate("/")

  return (
    <>
      <h1>Welcome to apapiai</h1>
      <GoogleSigninButton />
      <Chat />
    </>
  )
}

export default Welcome
