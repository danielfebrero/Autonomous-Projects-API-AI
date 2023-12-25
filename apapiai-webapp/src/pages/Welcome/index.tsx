import { useNavigate, useLocation } from "react-router-dom";

import GoogleSigninButton from "../../features/GoogleSigninButton"

const Welcome: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    if (location.pathname !== "/") navigate("/");
    return <GoogleSigninButton />
}

export default Welcome
