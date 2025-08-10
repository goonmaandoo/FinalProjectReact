import styles from '../../CSS/StoreManagement.module.css';
import { useState, useEffect } from 'react';

export default function OrderManagement() {
    const [storeCount, setStoreCount] = useState(0);
    const [store, setStore] = useState([]);
    const [selected, setSelected] = useState('all');
    const [keyword, setKeyword] = useState("");

    const handleChange = (e) => {
        setSelected(e.target.value);
    };

    const handleSearch = () => {
        let url = 'http://localhost:8080/store/search';
        if (selected !== 'all' && keyword.trim() !== '') {
            url += `?type=${selected}&keyword=${encodeURIComponent(keyword)}`;
        }
        fetch(url)
            .then(res => {
                if (!res.ok) throw new Error('서버 에러');
                return res.json();
            })
            .then(data => setStore(data))
            .catch(console.error);
    };
    //데이터 불러오기
    useEffect(() => {
        fetch('http://localhost:8080/store/storeCount')
            .then(res => {
                if (!res.ok) throw new Error('서버 에러');
                return res.json();
            })
            .then(count => setStoreCount(count))
            .catch(console.error);
        fetch('http://localhost:8080/store/userAll')
            .then(res => {
                if (!res.ok) throw new Error('서버 에러');
                return res.json();
            })
            .then(data => setStore(data))
            .catch(console.error);
    }, [])
    return (
        <>
            <div className={styles["input_value"]}>
                <select id="table_th" value={selected} onChange={handleChange}>
                    <option value="all">전체</option>
                    <option value="user">사용자</option>
                    <option value="storeName">가게이름</option>
                    <option value="storeAddress">가게주소</option>
                    <option value="tel">전화번호</option>
                </select>
                <input type='text' value={keyword} onChange={(e) => setKeyword(e.target.value)} />
                <button onClick={handleSearch}>검색</button>
            </div>

            <table className={styles["store_table"]}>
                <thead>
                    <tr>
                        <th>주문번호</th><th>채팅방</th><th>사용자ID</th><th>가게이름</th><th>가게주문</th><th>총주문금액</th><th>주문일시시</th>
                    </tr>
                </thead>
                <tbody>
                    {/* {store.map((item) => (
                        <tr key={item.id}>
                            <td>{item.id}</td><td>{item.nickName}</td><td>{item.storeName}</td><td>{item.storeAddress}</td><td>{item.minPrice}</td><td>{item.tel}</td>
                        </tr>
                    ))} */}
                </tbody>

            </table>
        </>
    )
}