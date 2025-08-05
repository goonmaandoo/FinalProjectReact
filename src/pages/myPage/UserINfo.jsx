import styles from '../../CSS/MyPage.module.css';
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from 'react-redux';
import FormattedDate from "../../component/funtion/common/FormattedDate";

export default function UserInfo() {
  const navigate = useNavigate();

  const user = useSelector((state) => state.auth.user);
  console.log("유저정보", user);
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  console.log("관리자여부", isAuthenticated);
  const editButton = () => {
    navigate("/mypage/edituser");
  }
  const quitButton = () => {
    alert("회원탈퇴 미구현")
  }
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
                <div className={styles.value}><FormattedDate dateString={user?.createdAt} /></div>
              </div>
              <div className={styles.myButtonContainer}>
                <button className={styles.editemailButton} onClick={pwcheckButton}>수정 및 탈퇴</button>
              </div>
            </div>
    )
}