import styles from '../../CSS/StoreManagement.module.css';
import style from '../../CSS/AdminPage.module.css';
import { useState, useEffect } from 'react';

export default function UserManagement() {
    const [subUserBtn, setSubUserBtn] = useState("all");
    const [userCount, setUserCount] = useState(0);
    const [totalCount, setTotalCount] = useState(0);
    const [unactiveCount, setUnactiveCount] = useState(0);
    const [banCount, setBanCount] = useState(0);
    const [userData, setUserData] = useState([]);
    const [selected, setSelected] = useState('nickname');
    const [keyword, setKeyword] = useState("");

    const handleChange = (e) => {
        setSelected(e.target.value);
    };

    const handleSearch = () => {
        let url = 'http://localhost:8080/api/users/';
        if (subUserBtn === 'all') {
            url += `userSearchAdmin?type=${selected}&keyword=${encodeURIComponent(keyword)}`;
        } else if (subUserBtn === 'user') {
            url += `userSearch?type=${selected}&keyword=${encodeURIComponent(keyword)}`;
        } else if (subUserBtn === 'owner') {
            url += `userOwnerSearch?type=${selected}&keyword=${encodeURIComponent(keyword)}`;
        }
        fetch(url)
            .then(res => {
                if (!res.ok) throw new Error('서버 에러');
                return res.json();
            })
            .then(data => setUserData(data))
            .catch(console.error);
    };
    //데이터 불러오기
    useEffect(() => {
        fetch('http://localhost:8080/api/users/totalCount')
            .then(res => {
                if (!res.ok) throw new Error('서버 에러');
                return res.json();
            })
            .then(count => setTotalCount(count))
            .catch(console.error);
        fetch('http://localhost:8080/api/users/unactiveCount')
            .then(res => {
                if (!res.ok) throw new Error('서버 에러');
                return res.json();
            })
            .then(count => setUnactiveCount(count))
            .catch(console.error);
        fetch('http://localhost:8080/api/users/banCount')
            .then(res => {
                if (!res.ok) throw new Error('서버 에러');
                return res.json();
            })
            .then(count => setBanCount(count))
            .catch(console.error);
    }, [])
    //role별로 데이터 불러오기
    useEffect(() => {
        let url = 'http://localhost:8080/api/users/'
        if (subUserBtn !== 'all') {
            url += `userBtnCount/${subUserBtn}`;
        } else {
            url += 'selectAllAdmin';
        }
        fetch(url)
            .then(res => {
                if (!res.ok) throw new Error('서버 에러');
                return res.json();
            })
            .then(data => setUserData(data))
            .catch(console.error);
        fetch(`http://localhost:8080/api/users/userBtnCountRole/${subUserBtn}`)
            .then(res => {
                if (!res.ok) throw new Error('서버 에러');
                return res.json();
            })
            .then(count => setUserCount(count))
            .catch(console.error);
    }, [subUserBtn])

    return (
        <>
            <div>
                <div className={style["side_menu_box"]}>
                    <div className={style["side_title"]}>회원관리{subUserBtn === "user" ? " - 사용자" : ""}{subUserBtn === "owner" ? " - 사장님" : ""}</div>
                    <div className={style["side_btn"]}>
                        <button className={subUserBtn === "all" ? style["active_btn"] : style["unactive_btn"]} onClick={() => { setSubUserBtn("all"); }}>전체</button>
                        <button className={subUserBtn === "user" ? style["active_btn"] : style["unactive_btn"]} onClick={() => { setSubUserBtn("user"); }}>사용자</button>
                        <button className={subUserBtn === "owner" ? style["active_btn"] : style["unactive_btn"]} onClick={() => { setSubUserBtn("owner"); }}>사장님</button>
                    </div>
                </div>
                <div className={style["side_detail"]}>사용자 정보와 활동을 관리하세요</div>
            </div>
            {subUserBtn !== "all" ?
                <div className={styles["store_box"]}>
                    <div className={styles["total_third"]}>
                        <div className={styles["total_title"]}>{subUserBtn === "user" ? "사용자" : "사장님"}</div>
                        <div className={styles["total_num"]}>{userCount}</div>
                    </div>
                    <img src={`http://localhost:8080/image/imgfile/admin/total_user.png`} />
                </div>
                :
                <>
                    <div className={styles["store_box"]}>
                        <div className={styles["total_third"]}>
                            <div className={styles["total_title"]}>총 회원수</div>
                            <div className={styles["total_num"]}>{totalCount}</div>
                        </div>
                        <img src={`http://localhost:8080/image/imgfile/admin/total_user.png`} />
                    </div>
                    <div className={styles["store_box"]}>
                        <div className={styles["total_third"]}>
                            <div className={styles["total_title"]}>탈퇴 회원</div>
                            <div className={styles["total_num"]}>{unactiveCount}</div>
                        </div>
                        <img src={`http://localhost:8080/image/imgfile/admin/unactive_user.png`} />
                    </div>
                    <div className={styles["store_box"]}>
                        <div className={styles["total_third"]}>
                            <div className={styles["total_title"]}>정지 회원</div>
                            <div className={styles["total_num"]}>{banCount}</div>
                        </div>
                        <img src={`http://localhost:8080/image/imgfile/admin/ban_user.png`} />
                    </div>
                </>}

            <div className={styles["input_value"]}>
                <select id="table_th" value={selected} onChange={handleChange}>
                    <option value="nickname">닉네임</option>
                    <option value="phoneNum">핸드폰번호</option>
                    <option value="email">이메일</option>
                </select>
                <input type='text' value={keyword} onChange={(e) => setKeyword(e.target.value)} />
                <button onClick={handleSearch}>검색</button>
            </div>
            <table className={styles["store_table"]}>
                <thead>
                    <tr>
                        <th>구분</th><th>닉네임</th><th>핸드폰번호</th><th>이메일</th><th>주소</th><th>상세주소</th><th>상태</th><th>모아머니</th>
                    </tr>
                </thead>
                <tbody>
                    {userData.map((item) => (
                        <tr key={item.id}>
                            <td>{item.id}</td><td>{item.nickname}</td><td>{item.phoneNum}</td><td>{item.email}</td><td>{item.address}</td><td>{item.addressDetail}</td><td className={styles['status_button']}>{item.status === 'ban' ? <div className={styles['status_ban']}>정지</div> : item.status === 'unactive' ? <div className={styles['status_unactive']}>탈퇴</div> : <div className={styles['status_active']}>활동중</div>}</td><td>{item.cash}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </>
    )
}