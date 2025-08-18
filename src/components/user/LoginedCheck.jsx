import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

function LoginedCheck({children}){
    const {isAuthenticated, loading} = useSelector((state) => state.auth);

    if(loading){
        return <div> 로딩중... </div>;
    }

    if (isAuthenticated) {
        return <Navigate to="/mainpage" replace />; // 로그인이 되어있으면 지정된 페이지로 리다이렉트
    }

    return children;
}

export default LoginedCheck;