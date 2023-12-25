import GoogleSigninButton from "../../features/GoogleSigninButton"
import Chat from "../../features/Chat"

import useRedux from "../../hooks/useRedux"

import "./style.scss"

const Welcome: React.FC = () => {
  const { useAppSelector } = useRedux
  const user = useAppSelector((state) => state.user)

  return (
    <div id="welcome-container">
      <h1>Welcome to apapiai</h1>
      {user.credential === undefined && <GoogleSigninButton />}
      <Chat />
    </div>
  )
}

export default Welcome
