import { useState } from "react";
import { useNavigate } from "react-router-dom";
import style from "../../CSS/Register.module.css";
import axios from "axios";

function OwnerRegister() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [nickname, setNickname] = useState("");
    const [phoneNum, setPhoneNum] = useState("");
    const [ownerNum, setOwnerNum] = useState("");
    const [isNicknameChecked, setIsNicknameChecked] = useState(null);
    const [isNicknameDuplicate, setIsNicknameDuplicate] = useState(null);

    const navigate = useNavigate();

    const checkNicknameDuplicate = async () => {
        if (!nickname.trim()) {
            alert("닉네임을 입력해주세요!");
            return;
        }

        try {
            const nicknameResult = await axios.get(`/api/users/nicknameCheck?nickname=${nickname}`)
            if (nicknameResult.data.duplicate) {
                setIsNicknameChecked(true);
                setIsNicknameDuplicate(true);
                alert("이미 사용 중인 닉네임입니다.");
            } else {
                setIsNicknameChecked(true);
                setIsNicknameDuplicate(false);
                alert("사용 가능한 닉네임입니다.")
            }
        } catch {
            console.log("중복확인 오류");
            alert("중복확인 오류")
        }

    };

    const handleRegister = async () => {
        if (!email || !password || !confirmPassword || !nickname || !phoneNum) {
            alert("모든 필드를 입력해주세요!");
            return;
        }

        if (password !== confirmPassword) {
            alert("비밀번호가 일치하지 않습니다!");
            return;
        }

        if (!isNicknameChecked) {
            alert("닉네임 중복확인을 해주세요!");
            return;
        }

        if (isNicknameDuplicate) {
            alert("이미 사용 중인 닉네임입니다.");
            return;
        }


        try {
            const response = await axios.post("/api/users/register", {
                email,
                password,
                nickname,
                phoneNum,
                role: "owner"
            });

            alert(response.data);
            navigate("/"); // 메인으로
        } catch {
            console.log("회원가입 실패");
            alert("회원가입 실패");
        }
    };

    return (
        <>

            <div className={style['register_container']}>
                <div className={style['register_h2']}>
                    <h2>회원가입</h2>
                </div>
                <table className={style['register_table']}>
                    <tbody>
                        <tr>
                            <td>● 이메일</td>
                            <td>
                                <input
                                    type="email"
                                    placeholder="이메일"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </td>
                        </tr>
                        <tr>
                            <td>● 비밀번호</td>
                            <td>
                                <input
                                    type="password"
                                    placeholder="비밀번호"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                            </td>
                        </tr>
                        <tr>
                            <td>● 비밀번호 확인</td>
                            <td>
                                <input
                                    type="password"
                                    placeholder="비밀번호 확인"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                />
                                {confirmPassword && confirmPassword !== password && (
                                    <div style={{ color: "red", fontSize: "0.8rem" }}>
                                        비밀번호가 일치하지 않습니다.
                                    </div>
                                )}
                            </td>
                        </tr>
                        <tr>
                            <td>● 닉네임</td>
                            <td>
                                <input
                                    type="text"
                                    placeholder="닉네임"
                                    value={nickname}
                                    onChange={(e) => (setNickname(e.target.value), setIsNicknameChecked(false))}
                                />
                                <button
                                    type="button"
                                    onClick={checkNicknameDuplicate}
                                    style={{ marginLeft: "8px" }}
                                >
                                    중복확인
                                </button>
                            </td>
                        </tr>
                        <tr>
                            <td>● 전화번호</td>
                            <td>
                                <input
                                    type="text"
                                    placeholder="전화번호"
                                    value={phoneNum}
                                    onChange={(e) => setPhoneNum(e.target.value)}
                                />
                            </td>
                        </tr>
                        <tr>
                            <td>● 사업자번호 </td>
                            <td>
                                <input
                                    type="text"
                                    placeholder="사업자번호"
                                    value={ownerNum}
                                    onChange={(e) => setOwnerNum(e.target.value)} />
                            </td>
                        </tr>
                    </tbody>
                </table>
                <br />
                <div className={style['register_button']}>
                    <button onClick={() => navigate("/")}>취소</button>
                    <button onClick={handleRegister}>회원가입</button>
                </div>

            </div>
        </>

    );
}

export default OwnerRegister;
