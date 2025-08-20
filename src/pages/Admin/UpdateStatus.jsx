import styles from "../../CSS/Admin/UpdateStatus.module.css"
import { useSearchParams } from "react-router-dom";
import { useState, useEffect } from 'react';
import axios from "axios";

export default function UpdateStatus() {
    const [searchParams] = useSearchParams();
    const id = searchParams.get("id");
    const [users, setUsers] = useState({});
    const [status, setStatus] = useState("");
    const [showBanDate, setShowBanDate] = useState(false);
    const [banDate, setBanDate] = useState("");
    const [statusBtn, setStatusBtn] = useState("");

    useEffect(() => {
        axios.get(`/api/users/UserInfo/${id}`)
            .then(res => {
                setUsers(res.data);
                setStatus(res.data.status);
                setStatusBtn(res.data.status);
            })
            .catch(console.error);
    }, [id]);

    const handleBanClick = () => {
        setShowBanDate(true);
    };
    const handleClose = () => {
        if (window.opener) {
            window.close();
        }
    }

    const handleBanConfirm = () => {
        if (!banDate) {
            alert("정지 종료 날짜를 선택하세요.");
            return;
        }
        handleUpdateClickBan("ban");
    };
    const handleUpdateClickBan = (newStatus) =>{
        axios.post(`/api/users/updateStatusBan`,null, {
            params: {
                id,
                status:newStatus,
                activeAt:new Date().toISOString()
            },
        })
            .then(res => {
                setUsers(res.data);
                setStatus(newStatus);
                setStatusBtn(newStatus);
                setShowBanDate(false);

                if (window.opener) {
                window.opener.location.reload();
                }
                window.close();
            })
            .catch(console.error);
    }

    const handleUpdateClick = (newStatus) =>{
        axios.post(`/api/users/updateStatus`,null, {
            params: {
                id,
                status:newStatus,
            },
        })
            .then(res => {
                setUsers(res.data);
                setStatus(newStatus);
                setStatusBtn(newStatus);
                setShowBanDate(false);

                if (window.opener) {
                window.opener.location.reload();
                }
                window.close();
            })
            .catch(console.error);
    }

    return(
        <main className={styles["main_container"]}>
            <div className={styles["main_nickname"]}>닉네임 : {users.nickname}</div>
            <div className={styles["main_tel"]}>이메일 : {users.email}</div>
            <div className={styles["main_tel"]}>상태 : 
                {users.status === "active" ? "활동중" : ""}
                {users.status === "ban" ? "정지" : ""}
                {users.status === "unactive" ? "탈퇴" : ""}</div>
            <div>상태변경 : </div>
            <div className={styles["update_button"]}>
                <button className={statusBtn === "ban" ? styles["unactive_btn"] : styles["active_btn"]} onClick={() => {setStatusBtn("ban"); setStatus("ban"); handleBanClick();}}>정지</button>
                <button className={statusBtn === "active" ? styles["unactive_btn"] : styles["active_btn"]} onClick={() => {setStatusBtn("active"); setStatus("active"); setShowBanDate(false);}}>활성화</button>
                <button className={statusBtn === "unactive" ? styles["unactive_btn"] : styles["active_btn"]} onClick={() => {setStatusBtn("unactive"); setStatus("unactive"); setShowBanDate(false);}}>탈퇴</button>
            </div>
            {showBanDate && (
                <div>
                    <div>정지 날짜 지정 : </div>
                    <input
                        type="text"
                        value={banDate}
                        onChange={(e) => setBanDate(e.target.value)}
                    />
                    <button onClick={handleBanConfirm}>확인</button>
                    <button onClick={() => setShowBanDate(false)}>취소</button>
                </div>
            )}
            <div>{users.status === "ban" ? "정지 남은 날짜" : ""}</div>
            <div className={styles["update_button1"]}>
                <button onClick={() => handleUpdateClick(status)}>확인</button>
                <button onClick={handleClose}>닫기</button>
            </div>
        </main>
    )
}