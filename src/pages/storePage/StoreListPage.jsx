import styles from '../../CSS/StoreListPage.module.css'
import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from 'react-router-dom';
import axios from "axios";
import { Link } from 'react-router-dom';

export default function StoreListPage() {
    const { categoryId } = useParams();
    const [category, setCategory] = useState([]);
    const selectedCategoryId = Number(categoryId) || 1;
    const [storeList, setStoreList] = useState([]);
    const categoryRef = useRef(null);
    const navigate = useNavigate();

    useEffect(() => {
        //카테고리 조회
        fetch('http://localhost:8080/category/all')
            .then(res => {
                if (!res.ok) throw new Error('서버 에러');
                return res.json();
            })
            .then(data => setCategory(data))
            .catch(console.error);
    }, []);
    useEffect(() => {
        //카테고리 Id별 가게 조회
        const url = selectedCategoryId === 1 ? `http://localhost:8080/store/all` : `http://localhost:8080/store/categoryId/${selectedCategoryId}`
        console.log('요청 URL:', url);
        axios.get(url)
            .then(res => {
                setStoreList(res.data);
            })
            .catch(console.error);
    }, [selectedCategoryId]);

    // 버튼 스크롤
    const scrollRight = () => {
        if (categoryRef.current) {
            categoryRef.current.scrollBy({ left: 200, behavior: "smooth" });
        }
    };
    const scrollLeft = () => {
        if (categoryRef.current) {
            categoryRef.current.scrollBy({ left: -200, behavior: "smooth" });
        }
    };
    //가게클릭
    const onStoreClick = (storeId) => {
        navigate(`/store/${storeId}`)
    }

    return (
        <div className={styles["storelist_body"]}>
            <div className={styles["circle_category_outer"]}>
                <button className={styles["scroll_button"]} onClick={scrollLeft}>
                    <img src="http://localhost:8080/image/imgfile/main_img/backbtn.png" alt="왼쪽" />
                </button>
                <div className={styles["circle_category_wrap"]} ref={categoryRef}>
                    {category.map((item) => (
                        <div key={item.id}
                            onClick={() => navigate(`/storelist/${item.id}`)} className={selectedCategoryId === item.id ? styles["selected"] : ""} >
                            <div className={styles["circle_with_text"]}>
                                <div className={styles["circle"]}>
                                    <img src={`http://localhost:8080/image/imgfile/category/${item.category}.png`} alt={`${item.category}`}
                                    />
                                </div>
                                <div className={styles["circle_text"]}>{item.num}</div>
                            </div>
                        </div>
                    ))}
                </div>
                <button className={styles["scroll_button"]} onClick={scrollRight}>
                    <img src="http://localhost:8080/image/imgfile/main_img/backbtn2.png" alt="오른쪽" />
                </button>
            </div>
            <div className={styles["second_body"]}>
                <div className={styles["storelist_wrap"]}>
                    {storeList.length > 0 ? (
                        storeList.map((item) => (
                            <Link key={item.id} to={`/store/${item.id}`} onClick={() => onStoreClick(item.id)}>
                                <div className={styles["img_explain_wrap"]}>
                                    <div className={styles["storesquare_img"]}>
                                        <img src={`http://localhost:8080/image/imgfile/store/store_${item.id}.jpg`} alt={`${item.storeName} 이미지`} />
                                    </div>
                                    <div className={styles["storeexplain"]}>
                                        <div className={styles["score_detail"]}>
                                            <div className={styles["score_name"]}>{item.storeName}</div>
                                            <div className={styles["store_star"]}>
                                                <span className={styles["star"]}>★</span>
                                                <span className={styles["score"]}>4.9(1689)</span>
                                            </div>
                                        </div>
                                        <div className={styles["score"]}>가게 위치: {item.storeAddress}</div>
                                        <div className={styles["score"]}>배달비: <span className={styles["deliveryfree"]}>무료배달</span></div>
                                        <div className={styles["score"]}>최소 주문: {item.minPrice}원</div>
                                        
                                    </div>
                                </div>
                            </Link>
                        ))
                    ) : (
                        <div className={styles.room_no_result}>
                            주문 가능한 가게가 없습니다.
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}