import styles from '../../CSS/StoreManagement.module.css';

export default function () {
    return (
        <>
        <div className={styles["store_box"]}>
            <div className={styles["total_third"]}>
                <div className={styles["total_title"]}>가게</div>
                <div className={styles["total_num"]}>?</div>
            </div>
            <img src={`http://localhost:8080/image/imgfile/admin/storemanage.png`} />
        </div>
        <table>
            <tr>
                <th>닉네임</th><th>핸드폰번호</th><th>이메일</th><th>주소</th><th>회원상태</th><th>가입일</th><th>모아머니</th>
            </tr>
        </table>
        </>
    )
}