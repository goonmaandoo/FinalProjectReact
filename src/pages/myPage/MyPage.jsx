import styles from "../../CSS/MyPage.module.css";
import { Link, Outlet, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import MyHeader from "./MyHeader";
import { useState, useEffect, useRef } from "react";
import GaugeBar from "../../component/funtion/common/gaugeBar";
import axios from "axios";

export default function MyPage() {
  const location = useLocation();
  const currentMenu = location.pathname.split("/").pop();
  const [profileUrl, setProfileUrl] = useState("");
  const [error, setError] = useState(null);
  const [cash, setCash] = useState(null);
  const popupRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const token = useSelector((s) => s.auth?.token);
  const [file, setFile] = useState(null);
  const [url, setUrl] = useState("");

  const basic_profile = "https://s3.us-east-1.amazonaws.com/delivery-bucket2025.08/profileimg/mypagePerson.png";

  //마이페이지 캐쉬 조회
  const fetchCash = async () => {
    if (!token) return;
    // setLoading(true);
    setError(null);
    try {
      const res = await axios.get("/api/users/cash", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCash(Number(res.data) || 0);
    } catch (e) {
      setError(e.response?.data || "캐쉬 조회 실패");
    } finally {
      // setLoading(false);
    }
  };

  useEffect(() => {
    fetchCash();
  }, [token]);

  // 팝업에서 충전 완료 postMessage 받으면 갱신
  useEffect(() => {
    const onMessage = (event) => {
      if (event.origin !== window.location.origin) return; // 보안
      if (event.data?.type === "CASH_CHARGED") {
        fetchCash();
      }
    };

    //이벤트 리스너
    window.addEventListener("message", onMessage);
    return () => {
      window.removeEventListener("message", onMessage);
    };
  }, [token]); // token 바뀌면 리바인딩

  //결제창 open
  const openChargePopup = () => {
    if (!token) {
      alert("로그인 후 이용해주세요.");
      return;
    }
    //캐쉬 충전창 중복 오픈 방지
    if (popupRef.current && !popupRef.current.closed) {
      popupRef.current.focus();
      return;
    }
    popupRef.current = window.open(
      "/cash/cashcharge",
      "_blank",
      "width=420,height=500"
    );
  };

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
    if (user?.id) {
      setUrl(`https://s3.us-east-1.amazonaws.com/delivery-bucket2025.08/profileimg/${user.id}/profile.png`);
    }
  }, [user]);

  


  const handleUpload = async (e) => {

    const selectedFile = e.target.files[0];

    if (!selectedFile) {
      alert("파일을 선택하세요!");
      return;
    }

    const formData = new FormData();
    formData.append("file", selectedFile);
    formData.append("userId", user.id.toString());

    try {
      const res = await axios.post("/api/files/upload/profile", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      console.log("업로드 성공:", res.data);
      setUrl(`https://s3.us-east-1.amazonaws.com/delivery-bucket2025.08/${res.data}`);
      alert("프로필 이미지가 업데이트 되었습니다!");
    } catch (err) {
      console.error("업로드 실패:", err);
      alert("업로드 실패: " + (err.response?.data || err.message));
    }
  };


  return (
    <main className={styles.myPage_main}>
      <div className={styles.myPage_box}>
        <div className={styles.myPage_userInfo}>
          <div className={styles.circle_with_text}>
            <img
              className={styles.circle}
              src={url || basic_profile}
              onError={(e) => (e.target.src = basic_profile)}
            />
            <div>
              <label className={styles.circle_text}>
                <input
                  type="file"
                  onChange={handleUpload}
                  className={styles.fileUpload}
                />
                <div>프로필수정</div>
                <img
                  className={styles.circle_pencil}
                  src="https://s3.us-east-1.amazonaws.com/delivery-bucket2025.08/imgfile/main_img/line-md_pencil (1).png"
                />
              </label>
            </div>
          </div>
          <div className={styles.userRating_body}>
            <div className={styles.userRating}>
              <div className={styles.userDetail}>
                <img
                  className={styles.bearImage}
                  src={`https://s3.us-east-1.amazonaws.com/delivery-bucket2025.08/imgfile/main_img/${bear}.png`}
                />
                <div className={styles.usernickName}>{user?.nickname} 님</div>
              </div>
              {user && <GaugeBar value={user.userRating} />}
            </div>
          </div>

          <div className={styles.user_cash}>
            <img
              className={styles["coin_imo"]}
              src="https://s3.us-east-1.amazonaws.com/delivery-bucket2025.08/imgfile/main_img/coin.png"
              alt="코인"
            />
            <div className={styles["coin_confirm"]}>
              {"" /* thousands(myCash) */}{" "}
              {loading || cash === null
                ? "로딩중..."
                : `${cash.toLocaleString()} 원`}
            </div>
            <button className={styles.charge_Button} onClick={openChargePopup}>
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
