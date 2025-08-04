import styles from '../../CSS/MyPage.module.css';
import { useEffect, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';

export default function EditUser() {

    const dispatch = useDispatch();
    const user = useSelector((state) => state.auth.user);
    const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

    const [nickname, setNickname] = useState("");
    const [password, setPassword] = useState("");

    const [isNicknameChecked, setIsNicknameChecked] = useState(null);
    const [isNicknameDuplicate, setIsNicknameDuplicate] = useState(null);

    const navigate = useNavigate();

    const nickNameChange = (e) => {
        setNickname(e.target.value ?? "");
    };
    const passwordChange = (e) => {
        setPassword(e.target.value ?? "");
    };

    if(!user){
        return <div> 로딩중 ... </div>
    }
    
    const editComplete = async () => {
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
    }

    const edituser = async () => {
        try {
            const result = await axios.post("/api/users/updatePassword",{
                id: user.id,
                nickname,
                password,
            })

            if(result.data === "success"){
                alert("회원정보가 수정되었습니다.");
                navigate("/mainpage");
            } else{
                alert("회원정보 수정에 실패했습니다.");
                dispatch({type: "LOGOUT"});
                navigate("/login");
            }
        } catch(error) {
            console.error("수정 실패 : ", error);
            alert("수정실패");
            dispatch({type: "LOGOUT"});
            navigate("/login");
        }
    }

    return (
        <div className={styles.userInfo}>
            <div className={styles.infoRow}>
                <div className={styles.label}>닉네임:</div>
                <input
                    type="text"
                    className={styles.editInput}
                    placeholder={user.nickname}
                    id="editNickname"
                    onChange={nickNameChange}

                />
                <button className={styles.editnameButton} onClick={editComplete}>
                    중복확인
                </button>
            </div>

            <div className={styles.infoRow}>
                <div className={styles.label}>이메일:</div>
                <input
                    type="text"
                    className={styles.editInput}
                    value={user.email}
                    readOnly
                />
            </div>
            <div className={styles.infoRow}>
                <div className={styles.label}>비밀번호:</div>
                <input
                    type="text"
                    className={styles.editInput}
                    value={password}
                    onChange={passwordChange}
                />
            </div>

            <div className={styles.infoRow}>
                <div className={styles.label}>가입일:</div>
                <input
                    type="text"
                    className={styles.editInput}
                    readOnly
                    value={user.createdAt}
                />
            </div>


            <div className={styles.info_Row}>
                <button className={styles.editemailButton} onClick={edituser}>
                    회원정보 수정하기
                </button>
            </div>
        </div>
    )
}