import { useState } from 'react';
import style from "../../CSS/ForgotPassword.module.css";
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function ForgotPassword() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [role, setRole] = useState("");
    const navigate = useNavigate();

    const edituser = async () => {
        try {
            const result = await axios.post("/api/users/resetPassword", {
                email,
                role,
                password,
            })

            if (result.data === "success") {
                alert("비밀번호가 재설정되었습니다.");
                navigate("/login");
            } else {
                alert("비밀번호 재설정에 실패했습니다.");
                navigate("/login");
            }
        } catch (error) {
            console.error("재설정 실패 : ", error);
            alert("비밀번호 재설정 중 오류 발생");
            navigate("/login");
        }
    }


    return (
        <>
            <div className={style["outer_wrapper"]}>
                <div className={style["resetpw_body_container"]}>
                    <form className={style["form_container"]}>
                        <h2>비밀번호 재설정</h2>
                        <h3> 이메일 </h3>
                        <input
                            type="email"
                            placeholder="이메일 주소 입력"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                        <h3> 비밀번호 </h3>
                        <input
                            type="password"
                            placeholder="새 비밀번호 입력"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />

                        <input type="password"
                            placeholder="비밀번호확인"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)} />
                        {confirmPassword && confirmPassword !== password && (
                            <div className={style["error-text"]}>
                                비밀번호가 일치하지 않습니다.
                            </div>
                        )}
                        <div className={style["radio_group"]}>
                            <label>
                                <input
                                    type="radio"
                                    value="owner"
                                    checked={role === "owner"}
                                    onChange={() => setRole("owner")}
                                />
                                사장님
                            </label>
                            <label>
                                <input
                                    type="radio"
                                    value="user"
                                    checked={role === "user"}
                                    onChange={() => setRole("user")}
                                />
                                일반유저
                            </label>
                        </div>

                        <button className={style["login-button"]} onClick={edituser}>
                            비밀번호 재설정하기
                        </button>
                    </form>
                </div>
            </div>

        </>


    );

};