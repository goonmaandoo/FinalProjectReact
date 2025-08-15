import styles from '../../CSS/Admin/StoreManagement.module.css';
import style from '../../CSS/Admin/AdminPage.module.css';
import { useState, useEffect } from 'react';

export default function Active1() {
    // const [userCount, setUserCount] = useState(0);
    const [totalCount, setTotalCount] = useState(0);
    const [unactiveCount, setUnactiveCount] = useState(0);
    const [banCount, setBanCount] = useState(0);
    const [userData, setUserData] = useState([]);
    const [selected, setSelected] = useState('nickname');
    const [keyword, setKeyword] = useState("");
    const [sendUserId, setSendUserId] = useState("");
    const [subBanBtn, setSubBanBtn] = useState("all");

    const handleChange = (e) => {
        setSelected(e.target.value);
    };

    const handleStatusClick = (id) => {
        window.open(`/updatestatus?id=${id}`, "_blank", "width=500,height=300");
    };

    const handleSearch = () => {
        let url = 'http://localhost:8080/api/users/';
        if (subBanBtn === 'all') {
            url += `userSearchActive?type=${selected}&keyword=${encodeURIComponent(keyword)}`;
        } else if (subBanBtn === 'unactive') {
            url += `userUnactiveSearch?type=${selected}&keyword=${encodeURIComponent(keyword)}`;
        } else if (subBanBtn === 'ban') {
            url += `userBanSearch?type=${selected}&keyword=${encodeURIComponent(keyword)}`;
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
    // role별로 데이터 불러오기
    useEffect(() => {
        let url = 'http://localhost:8080/api/users/'
        if (subBanBtn !== 'all') {
            url += `unactiveBan/${subBanBtn}`;
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
    }, [subBanBtn])

    return (
        <>
            <div>
                <div className={style["side_menu_box"]}>
                    <div className={style["side_title"]}>탈퇴/정지 회원 관리</div>
                    <div className={style["side_btn"]}>
                        <button className={subBanBtn === "all" ? style["active_btn"] : style["unactive_btn"]} onClick={() => { setSubBanBtn("all"); }}>전체</button>
                        <button className={subBanBtn === "unactive" ? style["active_btn"] : style["unactive_btn"]} onClick={() => { setSubBanBtn("unactive"); }}>탈퇴</button>
                        <button className={subBanBtn === "ban" ? style["active_btn"] : style["unactive_btn"]} onClick={() => { setSubBanBtn("ban"); }}>정지</button>
                    </div>
                </div>
                <div className={style["side_detail"]}>탈퇴회원과 정지회원을 관리하세요</div>
            </div>
            {subBanBtn !== "all" ?
                <div className={styles["store_box"]}>
                    <div className={styles["total_third"]}>
                        <div className={styles["total_title"]}>{subBanBtn === "unactive" ? "탈퇴 회원" : "정지 회원"}</div>
                        <div className={styles["total_num"]}>{subBanBtn === "unactive" ? unactiveCount : banCount}</div>
                    </div>
                    <img src={`http://localhost:8080/image/imgfile/admin/${subBanBtn}_user.png`} />
                </div>
                :
                <>
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
                    <option value="tel">전화번호</option>
                </select>
                <input type='text' value={keyword} onChange={(e) => setKeyword(e.target.value)} />
                <button onClick={handleSearch}>검색</button>
            </div>
            <table className={styles["store_table"]}>
                <thead>
                    <tr>
                        <th>구분</th><th>닉네임</th><th>핸드폰번호</th><th>이메일</th><th>주소</th><th>상세주소</th><th>상태</th><th>상태변경</th>
                    </tr>
                </thead>
                <tbody>
                    {userData.map((item) => (
                        <tr key={item.id}>
                            <td>{item.id}</td><td>{item.nickname}</td><td>{item.phoneNum}</td><td>{item.email}</td><td>{item.address}</td><td>{item.addressDetail}</td>
                            <td className={styles['status_button']}>
                                {item.status === 'ban' && <div className={styles['status_ban']}>정지</div>}
                                {item.status === 'unactive' && <div className={styles['status_unactive']}>탈퇴</div>}
                                {item.status === 'active' && <div className={styles['status_active']}>활성화</div>}
                            </td>
                            <td className={styles['status_update']}>
                                <button type='submit' onClick={() => handleStatusClick(item.id)}>상태변경</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </>
    )
}