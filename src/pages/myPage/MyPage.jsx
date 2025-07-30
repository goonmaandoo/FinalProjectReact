import styles from "../../CSS/MyPage.module.css";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import MyHeader from "./MyHeader";

export default function MyPage() {
    const location = useLocation();
    const currentMenu = location.pathname.split("/").pop();
    const menuList = [
        { name: "회원정보", path: "userinfo" },
        { name: "주문내역", path: "orderlist" },
        { name: "문의내역", path: "myqna" },
    ];
    return (
        <main className={styles.myPage_main}>
            <div className={styles.myPage_box}>
                <div className={styles.myPage_userInfo}>
                    <div className={styles.circle_with_text}>
                        <img
                            className={styles.circle}
                            src={"" /* profileUrl or basic_profile */}
                            onError={(e) => (e.target.src = "")}
                        />
                        <div>
                            <label className={styles.circle_text}>
                                <input type="file" onChange={() => { }} className={styles.fileUpload} />
                                <div>프로필수정</div>
                                <img
                                    className={styles.circle_pencil}
                                    src="https://epfwvrafnhdgvyfcrhbo.supabase.co/storage/v1/object/public/imgfile/main_img/line-md_pencil%20(1).png"
                                />
                            </label>
                        </div>
                    </div>
                    <div className={styles.userRating_body}>
                        <div className={styles.userRating}>
                            <div className={styles.userDetail}>
                                <img
                                    className={styles.bearImage}
                                    src={"" /* bear image src */}
                                />
                                <div className={styles.usernickName}>{"" /* myNickname */} 님</div>
                            </div>
                        </div>
                    </div>

                    <div className={styles.user_cash}>
                        <img
                            className={styles["coin_imo"]}
                            src="https://epfwvrafnhdgvyfcrhbo.supabase.co/storage/v1/object/public/imgfile/main_img/coin.png"
                            alt="코인"
                        />
                        <div className={styles["coin_confirm"]}>
                            {"" /* thousands(myCash) */}원
                        </div>
                        <button className={styles.charge_Button} onClick={() => { }}>
                            충전
                        </button>
                    </div>
                </div>
                <div className={styles.main_body}>
                    <ul className={styles.my_MenuUl}>
                        {menuList.map(({ name, path }) => (
                            <li key={path} className={styles.my_MenuLi}>
                                <Link
                                    to={`/mypage/${path}`}
                                    style={{
                                        textDecoration: "none",
                                        fontWeight: currentMenu === path ? "bold" : "normal",
                                        color: "black",
                                    }}
                                >
                                    {name}
                                </Link>
                            </li>
                        ))}
                    </ul>
                    <div className={styles.my_Menu_right}>
                        <MyHeader menuList={menuList} />
                        <Outlet></Outlet>
                    </div>
                </div>
            </div>
        </main>

    )
}