
import { Navigate } from "react-router-dom";

const PrivateRouter = ({ children }) => {

    const token = localStorage.getItem("token");
    return token ? children : <Navigate to='/login' replace />
}

export default PrivateRouter