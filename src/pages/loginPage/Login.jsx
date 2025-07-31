import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import style from "../../CSS/Login.module.css";

function Login() {
    const [user, setUser] = useState(null);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [nickname, setNickname] = useState("");
    const navigate = useNavigate();

    // 로그인
    const handleLogin = async () => {
        if (!email || !password) {
            alert("이메일과 비밀번호를 입력해주세요!");
            return;
        }

        try {
            const response = await fetch("/api/users/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email, password }),
            });

            if (!response.ok) {
                alert("로그인 실패: 이메일 또는 비밀번호를 확인하세요.");
                return;
            } else{
                alert("로그인 성공! 메인화면으로 이동합니다.");
                navigate("/mainpage");
            }

            const userData = await response.json();
            setUser(userData);
            setNickname(userData.nickname); // 만약 닉네임 필드 이름이 다르면 맞게 바꾸세요
        } catch (error) {
            console.error("로그인 에러:", error);
            alert("로그인 중 오류가 발생했습니다.");
        }

    };
    const onKeyDown = (e) => {
        if (e.key === "Enter") {
            handleLogin();
        }
    }

    return (
        <>
            <div className={style["login-container"]}>
                {user && nickname ? (
                    <div id="user_login">
                        {navigate("/mainpage")}
                    </div>
                ) : (
                    <div className={style["login-box"]}>
                        <div className={style["login-left"]}>
                            <img
                                src="https://epfwvrafnhdgvyfcrhbo.supabase.co/storage/v1/object/public/imgfile/main_img/login_logo.png"
                                alt="배달모아 로고"
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
        </>
    );
}

export default Login;
