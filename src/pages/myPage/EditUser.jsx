import styles from '../../CSS/MyPage.module.css';
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from 'react-redux';

export default function EditUser() {

    const user = useSelector((state) => state.auth.user);
    const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
    const [nickname, setNickname] = useState("");

    const nickNameChange = (e) => {
        setNickname(e.target.value ?? "");
    };

    const editComplete = () => {
        alert('수정버튼')
    }

    const sendResetEmail = () => {
        alert("무슨버튼이지")
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
                    value={nickname}
                />
                <button className={styles.editnameButton} onClick={editComplete}>
                    수정
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
                    value='password'
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
                <button onClick={sendResetEmail} className={styles.editemailButton}>
                    비밀번호 변경 / 이메일 전송
                </button>
            </div>
        </div>
    )
}