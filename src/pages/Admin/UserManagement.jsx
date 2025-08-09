import styles from '../../CSS/StoreManagement.module.css';
import { useState, useEffect } from 'react';

export default function UserManagement({ roleFilter }) {
    const [userCount, setUserCount] = useState(0);
    const [totalCount, setTotalCount] = useState(0);
    const [unactiveCount, setUnactiveCount] = useState(0);
    const [banCount, setBanCount] = useState(0);
    const [userData,setUserData] = useState([]);
    // const [selected, setSelected] = useState('all');
    // const [keyword, setKeyword] = useState("");

    // const handleChange = (e) => {
    //     setSelected(e.target.value);
    // };

    // const handleSearch = () => {
    //     let url = 'http://localhost:8080/store/search';
    //     if (selected !== 'all' && keyword.trim() !== '') {
    //         url += `?type=${selected}&keyword=${encodeURIComponent(keyword)}`;
    //     }
    //     fetch(url)
    //         .then(res => {
    //             if (!res.ok) throw new Error('서버 에러');
    //             return res.json();
    //         })
    //         .then(data => setStore(data))
    //         .catch(console.error);
    // };
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
        if(roleFilter !== 'all'){
            url += `userBtnCount/${roleFilter}`;
        }else{
            url +=  'selectAllAdmin';
        }
        fetch(url)
        .then(res => {
            if (!res.ok) throw new Error('서버 에러');
            return res.json();
        })
        .then(data => setUserData(data))
        .catch(console.error);
        fetch(`http://localhost:8080/api/users/userBtnCountRole/${roleFilter}`)
            .then(res => {
                if (!res.ok) throw new Error('서버 에러');
                return res.json();
            })
            .then(count => setUserCount(count))
            .catch(console.error);
    }, [roleFilter])

    return (
        <>
            {roleFilter !== "all" ? 
            <div className={styles["store_box"]}>
                <div className={styles["total_third"]}>
                    <div className={styles["total_title"]}>{roleFilter === "user" ? "사용자" : "사장님"}</div>
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
            
            {/* <div className={styles["input_value"]}>
                <select id="table_th" value={selected} onChange={handleChange}>
                    <option value="nickname">닉네임</option>
                    <option value="storeName">가게이름</option>
                    <option value="tel">전화번호</option>
                </select>
                <input type='text' value={keyword} onChange={(e) => setKeyword(e.target.value)} />
                <button onClick={handleSearch}>검색</button>
            </div> */}
            <table className={styles["store_table"]}>
                <thead>
                    <tr>
                    <th>구분</th><th>닉네임</th><th>핸드폰번호</th><th>이메일</th><th>주소</th><th>상세주소</th><th>회원상태</th><th>모아머니</th>
                    </tr>
                </thead>
                <tbody>
                    {userData.map((item) => (
                        <tr key={item.id}>
                            <td>{item.id}</td><td>{item.nickname}</td><td>{item.phoneNum}</td><td>{item.email}</td><td>{item.address}</td><td>{item.addressDetail}</td><td>{item.status}</td><td>{item.cash}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </>
    )
}