import { GoogleLogin } from "@react-oauth/google"

import useRedux from "../../hooks/useRedux"
import { signin, GoogleSigninResponse } from "../../reducers/user"

const GoogleSigninButton: React.FC = () => {
  const { useAppDispatch } = useRedux()

  const dispatch = useAppDispatch()

  const handleLogin = (gsr: GoogleSigninResponse) => {
    dispatch(signin(gsr))
  }

  return (
    <GoogleLogin
      onSuccess={handleLogin}
      onError={() => {
        console.log("Login Failed")
      }}
      useOneTap
      auto_select
    />
  )
}

export default GoogleSigninButton
