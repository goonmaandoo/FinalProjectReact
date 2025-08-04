import styles from '../../CSS/MyPage.module.css';
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';

export default function PasswordCheck() {
    const user = useSelector((state) => state.auth.user); // 로그인된 사용자
    const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const [confirmPassword, setConfirmPassword] = useState("");
    const navigate = useNavigate();


    const edituser = async () => {
        try {
            const response = await axios.post("/api/users/login", {
                email: user.email,
                password: password
            });

            if (response.data && response.data.user) {
                // 비밀번호 일치하면 수정 페이지
                navigate("/mypage/edituser");
            } else {
                setError("비밀번호가 일치하지 않습니다.");
            }
        } catch (error) {
            if (error.response && error.response.status === 401) {
                setError("비밀번호가 일치하지 않습니다.");
            } else {
                console.error("비밀번호 확인 오류:", error);
                setError("오류가 발생했습니다.");
            }
        }
    }

    return (
        <>
            <div className={styles.userInfo}>
                <div className={styles.infoRow}>
                    <div className={styles.label}>이메일 :</div>
                    <input
                        type="text"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </div>
                <div className={styles.infoRow}>
                    <div className={styles.label}>비밀번호 :</div>
                    <input
                        type="password"
                        placeholder="비밀번호"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </div>

                {error && <div style={{ color: 'red' }}>{error}</div>}

                <div className={styles.myButtonContainer}>
                    <button className={styles.myButtonEdit} onClick={edituser}>수정하기</button>
                    <button className={styles.myButtonQuit}>회원탈퇴</button>
                </div>
            </div>

        </>
    )
}