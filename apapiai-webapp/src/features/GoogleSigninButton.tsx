import { GoogleLogin } from "@react-oauth/google";

type Props = {};

const GoogleSigninButton: React.FC<Props> = () => {
  return (
    <GoogleLogin
      onSuccess={(credentialResponse) => {
        console.log(credentialResponse);
      }}
      onError={() => {
        console.log("Login Failed");
      }}
      useOneTap
      auto_select
    />
  );
};

export default GoogleSigninButton;
