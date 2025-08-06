import styles from '../CSS/Hamburger.module.css'
import { useEffect, useState, useRef, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../redux/user';
import { motion, AnimatePresence } from "framer-motion";

export default function Hamburger({ isOpen, onClose }) {
    const [isReady, setIsReady] = useState(false);
    const menuRef = useRef();
    const [userRoom, setUserRoom] = useState([]);
    const [menuHeight, setMenuHeight] = useState("auto");
    const [myRating, setMyRating] = useState(0);
    const [face, setFace] = useState("soso");
    const dispatch = useDispatch();
    const [menuOpen, setMenuOpen] = useState(false);
    const navigate = useNavigate();


    const user = useSelector((state) => state.auth.user);
    const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

    const handleLogout = () => {
        dispatch(logout());
        localStorage.removeItem("token");
        navigate("/mainpage");
    }

    useEffect(() => {
        function updateHeight() {
            const footer = document.querySelector("footer");
            const footerHeight = footer ? footer.offsetHeight : 0;
            const docHeight = document.body.scrollHeight;
            const topOffset = 115;

            const calculatedHeight = docHeight - footerHeight - topOffset;
            setMenuHeight(calculatedHeight > 0 ? calculatedHeight : "auto");
        }

        updateHeight();
        window.addEventListener("resize", updateHeight);

        return () => {
            window.removeEventListener("resize", updateHeight);
        };

    }, []);

    useEffect(() => {
        const handleClickOutside = (e) => {
            // 햄버거 버튼 클릭은 제외
            const isHamburgerButton = e.target.closest('[class*="hamburger_btn"]') ||
                e.target.closest('[class*="main_hamburger_btn"]');
            if (isHamburgerButton) {
                return;
            }
            if (menuRef.current && !menuRef.current.contains(e.target)) {
                onClose();
            }
        };
        if (isOpen) {
            // 약간의 지연을 주어 초기 클릭과 분리
            const timer = setTimeout(() => {
                document.addEventListener("mousedown", handleClickOutside);
            }, 50);
            return () => {
                clearTimeout(timer);
                document.removeEventListener("mousedown", handleClickOutside);
            };
        }
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [isOpen, onClose]);


    if (!isOpen) return null;

    return (
        <>
            <div className={styles["main"]} ref={menuRef}>
                <div className={styles["hamburger_nav"]} style={{ height: `${menuHeight - 60}px` }}>
                    <div className={styles["mypage"]}>
                        <img
                            className={styles["mypage_icon"]}
                            src="http://localhost:8080/image/imgfile/main_img/home-black.png"
                            alt="마이페이지"
                        />
                        <div className={styles["mypage_text"]}>
                            {user ? <Link to="/mypage/userinfo" onClick={onClose} >마이페이지</Link> : <Link to="/mainpage">마이페이지</Link>}
                        </div>
                    </div>
                    {user ? (
                        <>
                            <div className={styles["user_coin"]}>
                                <div className={styles["user_box"]}>
                                    <div>
                                        <img
                                            className={styles["user_profile_image"]}
                                            src={user?.profileUrl || "http://localhost:8080/image/profileimg/mypagePerson.png"}
                                            onError={(e) => (e.currentTarget.src = "http://localhost:8080/image/profileimg/mypagePerson.png")} />
                                    </div>
                                    <div className={styles["userName"]}>{user?.nickname}님</div>
                                    <button className={styles["userName_btn"]} onClick={handleLogout}>로그아웃</button>
                                </div>
                                <div className={styles["coin_box"]}>
                                    <img
                                        className={styles["coin_imo"]}
                                        src="http://localhost:8080/image/imgfile/main_img/coin.png"
                                        alt="코인"
                                    />
                                    <div className={styles["coin_confirm"]}>
                                        {user?.cash ?? 0}
                                    </div>
                                </div>
                            </div>
                            <div className={styles["score_box"]}>
                                <div className={styles["score_text"]}>{user.userRating}%</div>
                                <img className={styles["score_img"]} src={`http://localhost:8080/image/imgfile/main_img/${face}.png`} />
                            </div>
                            <progress className={styles["gongu_progress"]} value={user.userRating} max={100}></progress>
                        </>
                    ) : (
                        <div id={styles["user_notlogin"]}>
                            <Link to="/login">로그인이 필요합니다</Link>
                        </div>
                    )}
                    <div className={styles["event_banner"]}>
                        <img
                            className={styles["event_banner1"]}
                            src="http://localhost:8080/image/imgfile/main_img/event_banner1.png"
                            alt="배너1"
                        />
                        <img
                            className={styles["event_banner2"]}
                            src="http://localhost:8080/image/imgfile/main_img/event_banner2.png"
                            alt="배너2"
                        />
                    </div>
                    {user && (
                        <div className={styles["chat_list"]}>
                            <div className={styles["chat_list_title"]}>참여중인 채팅방 목록</div>

                        </div>
                    )}
                </div>
            </div>
            <div>
                <AnimatePresence>
                        <motion.nav key="mobile-nav" initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.4 }} style={{ originY: 0 }} ref={menuRef} className={styles.small_menu} >
                            <div className={styles["mypage"]}>
                                <img
                                    className={styles["mypage_icon2"]}
                                    src="http://localhost:8080/image/imgfile/main_img/home-black.png"
                                    alt="마이페이지"
                                />
                                <div className={styles["mypage_text2"]}>
                                    {user ? <Link to="/mypage/userinfo" onClick={onClose} >마이페이지</Link> : <Link to="/mainpage">마이페이지</Link>}
                                </div>
                            </div>
                            {user ? (
                                <>
                                    <div className={styles["user_coin"]}>
                                        <div className={styles["user_box"]}>
                                            <div>
                                                <img
                                                    className={styles["user_profile_image"]}
                                                    src={user?.profileUrl || "http://localhost:8080/image/profileimg/mypagePerson.png"}
                                                    onError={(e) => (e.currentTarget.src = "http://localhost:8080/image/profileimg/mypagePerson.png")} />
                                            </div>
                                            <div className={styles["userName"]}>{user?.nickname}님</div>
                                            <button className={styles["userName_btn"]} onClick={handleLogout}>로그아웃</button>
                                        </div>
                                        <div className={styles["coin_box"]}>
                                            <img
                                                className={styles["coin_imo"]}
                                                src="http://localhost:8080/image/imgfile/main_img/coin.png"
                                                alt="코인"
                                            />
                                            <div className={styles["coin_confirm"]}>
                                                {user.cash !== null ? user.cash.toLocaleString() : "0"}
                                            </div>
                                        </div>
                                    </div>
                                    <div className={styles["score_box"]}>
                                        <div className={styles["score_text"]}>{user.userRating}%</div>
                                        <img className={styles["score_img"]} src={`http://localhost:8080/image/imgfile/main_img/${face}.png`} />
                                    </div>
                                    <progress className={styles["gongu_progress"]} value={user.userRating} max={100}></progress>
                                </>
                            ) : (
                                <div id={styles["user_notlogin2"]}>
                                    <Link to="/login">로그인이 필요합니다</Link>
                                </div>
                            )}
                            {user && (
                                <div className={styles["chat_list"]}>
                                    <div className={styles["chat_list_title"]}>참여중인 채팅방 목록</div>

                                </div>
                            )}
                        </motion.nav>
                </AnimatePresence>
            </div>
        </>

    )
}