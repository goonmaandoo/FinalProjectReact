import style from "../../CSS/OwnerHeader.module.css";
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from "react-router-dom";
import { logout } from '../../redux/user';

export default function OwnerHeader() {
    const dispatch = useDispatch();

    const user = useSelector((state) => state.auth.user);
    const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

    const navigate = useNavigate();

    const handleLogout = () => {
        dispatch(logout());
        localStorage.removeItem("token");
        navigate("/mainpage");
    }
    return (
        <>
            <div className={style["owner_header"]}>
                <div className={style["title"]}> 배달모아 - 사장님 페이지</div>
                <div className={style["userinfo"]}>
                    <div className={style["userName"]}>{user?.nickname}님</div>
                    <button className={style["userName_btn"]} onClick={handleLogout}>로그아웃</button>
                </div>

            </div>
        </>

    )
}