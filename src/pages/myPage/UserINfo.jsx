import styles from '../../CSS/MyPage.module.css';
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from 'react-redux';

export default function UserInfo() {
  const navigate = useNavigate();  

  const dispatch = useDispatch();

  const user = useSelector((state) => state.auth.user);
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const pwcheckButton = () => {
        navigate("/mypage/passwordcheck");
    }
    return (
          <div className={styles.userInfo}>
              <div className={styles.infoRow}>
                <div className={styles.label}>닉네임:</div>
                <div className={styles.value}> {user?.nickname} </div>
              </div>
              <div className={styles.infoRow}>
                <div className={styles.label}>이메일:</div>
                <div className={styles.value}>{user?.email} </div>
              </div>
              <div className={styles.infoRow}>
                <div className={styles.label}>전화번호:</div>
                <div className={styles.value}>{user?.phoneNum}</div>
              </div>
              <div className={styles.infoRow}>
                <div className={styles.label}>가입일:</div>
                <div className={styles.value}>{user?.createdAt}</div>
              </div>
              <div className={styles.myButtonContainer}>
                <button className={styles.myButtonEdit} onClick={pwcheckButton}>수정하기</button>
                <button className={styles.myButtonQuit} onClick={pwcheckButton}>회원탈퇴</button>
              </div>
            </div>
    )
}