import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import style from "../../CSS/Login.module.css";
import { useDispatch } from "react-redux";
import { loginSuccess } from "../../redux/user"; 

function Login() {
    const [user, setUser] = useState(null);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [nickname, setNickname] = useState("");
    const navigate = useNavigate();
    const dispatch = useDispatch(); // 디스패치 선언

    const handleLogin = async () => {
        if (!email || !password) {
            alert("이메일과 비밀번호를 입력해주세요!");
            return;
        }

        try {
            const response = await axios.post("/api/users/login", { email, password });

            if (response.data) {
                const {user, token} = response.data; // 구조분해

                if(user.status === "unactive"){
                    alert("비활성화된 계정입니다.");
                    return;
                }
                if(user.status === "ban"){
                    alert("정지된 계정입니다. 로그인할 수 없습니다.");
                    return;
                }

                alert("로그인 성공! 메인화면으로 이동합니다.");
                setUser(response.data);
                localStorage.setItem("token", token);
                dispatch(loginSuccess(user, token)); // redux에 저장
                setNickname(response.data.nickname);

                if(user.role === "owner"){
                    navigate("/ownerpage");
                }else if(user.role === "admin") {
                    navigate("/adminpage");
                } else {
                    navigate("/mainpage");
                }
                
            }
        } catch (error) {
            if (error.response && error.response.status === 401) {
                alert("로그인 실패: 이메일 또는 비밀번호를 확인하세요.");
            } else {
                console.error("로그인 에러:", error);
                alert("로그인 중 오류가 발생했습니다.");
            }
        }
    };

    const onKeyDown = (e) => {
        if (e.key === "Enter") {
            handleLogin();
        }
    };

    return (
        <div className={style["login-container"]}>
            {user && nickname ? (
                <div id="user_login"></div>
            ) : (
                <div className={style["login-box"]}>
                    <div className={style["login-left"]}>
                        <img
                            src="https://s3.us-east-1.amazonaws.com/delivery-bucket2025.08/imgfile/main_img/main_logo.png" alt='로고'
                            className={style["login-logo"]}
                        />
                    </div>
                    <div className={style["login-right"]}>
                        <input
                            type="email"
                            placeholder="이메일"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                        <input
                            type="password"
                            placeholder="비밀번호"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            onKeyDown={onKeyDown}
                        />
                        <div className={style["login-options"]}>
                            <Link to="/forgotpw">비밀번호 찾기</Link>
                            <Link to="/ownerusercheck">회원가입</Link>
                        </div>
                        <button className={style["login-button"]} onClick={handleLogin}>
                            로그인
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Login;
