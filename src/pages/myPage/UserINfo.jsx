import styles from '../../CSS/MyPage.module.css';
import { useNavigate } from "react-router-dom";

export default function UserInfo() {
  const navigate = useNavigate();  
  const editButton = () => {
        navigate("/mypage/edituser");
    }
    const quitButton = () => {
        alert("버튼만들기")
    }
    return (
          <div className={styles.userInfo}>
              <div className={styles.infoRow}>
                <div className={styles.label}>닉네임:</div>
                <div className={styles.value}> nickname </div>
              </div>
              <div className={styles.infoRow}>
                <div className={styles.label}>이메일:</div>
                <div className={styles.value}>email</div>
              </div>
              <div className={styles.infoRow}>
                <div className={styles.label}>가입일:</div>
                <div className={styles.value}>createdAt</div>
              </div>
              <div className={styles.myButtonContainer}>
                <button className={styles.myButtonEdit} onClick={editButton}>수정하기</button>
                <button className={styles.myButtonQuit} onClick={quitButton}>회원탈퇴</button>
              </div>
            </div>
    )
}