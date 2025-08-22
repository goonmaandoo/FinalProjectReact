import styles from '../../CSS/Components/MainHeader.module.css'
import React, { useState, useEffect,useRef } from 'react';
import KakaoMap from "../../components/Kakaomap";
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../../redux/user';
import axios from "axios";


import { Link } from "react-router-dom";

export default function MainHeader({ toggleMenu }) {
    const [address, setAddress] = useState("");
    const [addressDetail, setAddressDetail] = useState("");
    const [showMapModal, setShowMapModal] = useState(false);
    const [users, setUsers] = useState({});
    const closeMapModal = () => setShowMapModal(false);

    const user = useSelector((state) => state.auth.user);
    const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

    //햄버거버튼
    const handleHamburgerClick = (e) => {
        e.stopPropagation();
        toggleMenu(e);
    }
    
    const handleClick = () => {
        new window.daum.Postcode({
            oncomplete: function (data) {
                setAddress(data.address);
                setShowMapModal(true);
            },
        }).open();
    };

    useEffect(() => {
        const check = setInterval(() => {
            if (
                window.kakao &&
                window.kakao.maps &&
                window.kakao.maps.services &&
                window.kakao.maps.services.Geocoder
            ) {
                clearInterval(check);
            }
        }, 100);
        return () => clearInterval(check);
    }, []);

    //주소 업데이트
    async function updateAddress(address, addressDetail) {
        if (!user?.id) return;
        await axios.post("/api/users/addressUpdateDetail", {
            id: user.id,
            address: address,
            addressDetail: addressDetail,
        })
            .then(() => {
                console.log("주소 저장 성공")
                window.location.reload();
            })
            .catch(console.error);
        fetch(`/api/users/UserInfo/${user.id}`)
            .then(res => {
                if (!res.ok) throw new Error('서버 에러');
                return res.json();
            })
            .then(data => {
                setUsers(data);
            })
            .catch(console.error);
    }
    const saveAddress = () => {
        if (!addressDetail) {
            alert('상세주소를 입력하세요.');
            return;
        }
        updateAddress(address, addressDetail);
        closeMapModal();
    }

    return (
        <header className={styles["main_header"]}>
            <div className={styles["main_container"]}>
                <div className={styles["hLogo_img"]}>
                    <Link to="/mainpage" className={styles["hLogo_link"]}>
                        <img src="https://s3.us-east-1.amazonaws.com/delivery-bucket2025.08/imgfile/main_img/main_logo.png" alt='로고' />
                    </Link>
                </div>
                <div>
                    <ul className={styles["main_menu"]}>
                        <li><Link to="/storelist/1">메뉴</Link></li>
                        <li>
                            <Link to="roomPage/AllRoom" state="">진행중인 공구</Link>
                        </li>
                        <li>
                            <Link to="/mypage">마이페이지</Link>
                        </li>
                    </ul>
                </div>
                <div className={styles["location"]}>
                    <div className={styles["location_gps"]}>
                        {isAuthenticated ? (
                            <>
                                <button className={styles["location_btn"]} onClick={handleClick}>
                                    <img className={styles["location_icon"]} src="https://s3.us-east-1.amazonaws.com/delivery-bucket2025.08/imgfile/main_img/location_icon_red.png" />
                                </button>
                                <div onClick={handleClick}>{user.address || "주소를 입력하세요"}</div>
                            </>
                        ) : (
                            <>
                                <Link to="/login"className={styles["login"]}> 로그인 </Link>
                                <Link to="/ownerusercheck" className={styles["login_join"]}> 회원가입 </Link>
                            </>
                        )}
                        {showMapModal && (
                            <div className={styles["modalStyle"]}>
                                <div className={styles["popupStyle"]} onClick={(e) => e.stopPropagation()}>
                                    <KakaoMap address={address} className={styles["modal_map"]} />
                                    <div className={styles["modal_address"]}>
                                        <div className={styles["label_box"]}>주소</div>
                                        <input className={styles["address_not"]} type="text" placeholder="주소" value={address} readOnly />
                                    <div className={styles["label_box"]}>상세주소</div>
                                        <input className={styles["address_not"]} type="text" value={addressDetail} onChange={(e) => setAddressDetail(e.target.value)} placeholder="상세주소" />
                                        <div className={styles["modal_btns"]}>
                                        <button
                                            onClick={saveAddress} className={styles["modal_btn"]}>
                                            확인
                                        </button>
                                        <button
                                            onClick={closeMapModal} className={styles["modal_btn"]}>
                                            닫기
                                        </button>
                                    </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
                <div className={styles["main_hamburger"]}>
                    <button onClick={handleHamburgerClick} className={styles["main_hamburger_btn"]}>
                        <img
                            src="https://s3.us-east-1.amazonaws.com/delivery-bucket2025.08/imgfile/main_img/main_hamburger-md.png"
                            alt="햄버거 메뉴"
                        />
                    </button>
                </div>
            </div>
        </header>
    )
}