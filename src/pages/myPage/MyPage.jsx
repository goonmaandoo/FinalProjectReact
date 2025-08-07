import styles from "../../CSS/MyPage.module.css";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import MyHeader from "./MyHeader";
import { useState, useEffect } from "react";
import GaugeBar from "../../component/funtion/common/gaugeBar";
import axios from "axios";
export default function MyPage() {
  const location = useLocation();
  const currentMenu = location.pathname.split("/").pop();
  const [profileUrl, setProfileUrl] = useState("");
  const dispatch = useDispatch();

  const user = useSelector((state) => state.auth.user);
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

  const menuList = [
    { name: "회원정보", path: "userinfo" },
    { name: "주문내역", path: "orderlist" },
    { name: "문의내역", path: "myqna" },
    { name: "내 리뷰", path: "myreview" },
  ];
  const [bear, setBear] = useState("web_logo");
  useEffect(() => {
    if (!user) return;
    console.log("유저레이팅:", user.userRating);
    if (user.userRating >= 80) {
      setBear("good");
    } else if (user.userRating < 30) {
      setBear("bad");
    } else {
      setBear("soso");
    }
  }, [user]);

  useEffect(() => {
    if (user?.profileUrl) {
      setProfileUrl(`http://localhost:8080${user.profileUrl}`);
    }
  }, [user]);

  const basic_profile =
    "https://epfwvrafnhdgvyfcrhbo.supabase.co/storage/v1/object/public/profile-image/mypagePerson.png";

  const updateProfile = async (file) => {
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("userId", user.id);

      const res = await axios.post("/api/users/uploadProfileImage", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      const profileUrlFromBackend = res.data.profileUrl;
      console.log("백엔드에서 받은 profileUrl:", profileUrlFromBackend);
      setProfileUrl(
        `http://localhost:8080${profileUrlFromBackend}?t=${new Date().getTime()}`
      );
      alert("프로필 이미지가 업데이트 되었습니다!");
    } catch (e) {
      console.error("업로드 실패:", e);
      alert("실패");
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    updateProfile(file);
  };
  return (
    <main className={styles.myPage_main}>
      <div className={styles.myPage_box}>
        <div className={styles.myPage_userInfo}>
          <div className={styles.circle_with_text}>
            <img
              className={styles.circle}
              src={profileUrl || basic_profile}
              onError={(e) => (e.target.src = basic_profile)}
            />
            <div>
              <label className={styles.circle_text}>
                <input
                  type="file"
                  onChange={handleFileChange}
                  className={styles.fileUpload}
                />
                <div>프로필수정</div>
                <img
                  className={styles.circle_pencil}
                  src="http://localhost:8080/image/imgfile/main_img/line-md_pencil (1).png"
                />
              </label>
            </div>
          </div>
          <div className={styles.userRating_body}>
            <div className={styles.userRating}>
              <div className={styles.userDetail}>
                <img
                  className={styles.bearImage}
                  src={`http://localhost:8080/image/imgfile/main_img/${bear}.png`}
                />
                <div className={styles.usernickName}>{user?.nickname} 님</div>
              </div>
              {user && <GaugeBar value={user.userRating} />}
            </div>
          </div>

          <div className={styles.user_cash}>
            <img
              className={styles["coin_imo"]}
              src="http://localhost:8080/image/imgfile/main_img/coin.png"
              alt="코인"
            />
            <div className={styles["coin_confirm"]}>
              {"" /* thousands(myCash) */}원
            </div>
            <button className={styles.charge_Button} onClick={() => {}}>
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
  );
}
