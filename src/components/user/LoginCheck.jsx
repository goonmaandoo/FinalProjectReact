import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

function LoginCheck({children}){
    const {isAuthenticated, loading} = useSelector((state) => state.auth);

    if(loading){
        return <div> 로딩중... </div>;
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />; // 로그인이 되어있지 않으면 로그인 페이지로 리다이렉트
    }

    return children;
}

export default LoginCheck;