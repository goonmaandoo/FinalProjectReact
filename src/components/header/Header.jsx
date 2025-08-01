import styles from '../../CSS/Header.module.css'
import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../../redux/user';

export default function Header() {
    const [keyword, setKeyword] = useState('');
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const user = useSelector((state) => state.auth.user);
    const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

    const handleLogout = () => {
        dispatch(logout());
        localStorage.removeItem("token");
        navigate("/mainpage");
    }

    //검색창
    const onKeyDown = (e) => {
        if (e.key === "Enter") {
            search();
        }
    }
    const search = () => {
        if (!keyword.trim()) {
            alert("검색어를 입력하세요.");
            return;
        }
        navigate(`/`);
    };

    return (
        <div className={styles["header"]}>
            <div className={styles["container"]}>
                <div className={styles["hLogo_img"]}>
                    <Link to="/mainpage" className={styles["hLogo_link"]}>
                        <img src="http://localhost:8080/image/imgfile/main_img/header_logo.png" alt='로고'/>
                    </Link>
                </div>
                <div className={styles["search"]}>
                    <input
                            type="text"
                            className={styles["search_value"]}
                            value={keyword}
                            onChange={(e) => setKeyword(e.target.value)}
                            onKeyDown={onKeyDown}
                            placeholder="음식점 또는 메뉴를 검색해보세요"
                        />
                    <button onClick={search} className={styles["search_btn"]}>
                            검색
                    </button>
                </div>
                <div className={styles["location"]}>
                    <div className={styles["location_gps"]}>

                    </div>
                </div>
                <div className={styles[""]}>
                    {isAuthenticated ? (
                        <>
                        <span>{user?.nickname} 님 </span>
                        <button onClick={handleLogout}> 로그아웃 </button>
                        </>

                    ) : (
                        <>
                            <Link to="/login"> 로그인 </Link>
                            <Link to="/ownerusercheck"> 회원가입 </Link>
                        </>
                    )}
                </div>
                <div className={styles["hamburger"]}>
                        <button onClick={(e) => {
                            e.stopPropagation();
                            toggleMenu(e);
                        }} className={styles["hamburger_btn"]}>
                            <img
                                src="http://localhost:8080/image/imgfile/main_img/hamburger-md.png"
                                alt="햄버거 메뉴"
                            />
                        </button>
                    </div>
            </div>
        </div>
    )
}