import styles from '../../CSS/MainHeader.module.css'
import React, { useState, useRef } from 'react';

import { Link } from "react-router-dom";

export default function MainHeader({ toggleMenu }) {
    const [address, setAddress] = useState("");
    const [showMapModal, setShowMapModal] = useState(false);
    
    const handleHamburgerClick = (e) => {
        e.stopPropagation();
        toggleMenu(e);
    }
    const handleClick = () => {
        new window.daum.Postcode({
            oncomplete: function (data) {
                setAddress(data.address);
                // updateAddress(data.address);
                setShowMapModal(true);
            },
        }).open();
    };

    return (
        <header className={styles["main_header"]}>
            <div className={styles["main_container"]}>
                <div className={styles["hLogo_img"]}>
                    <Link to="/mainpage" className={styles["hLogo_link"]}>
                        <img src="http://localhost:8080/image/imgfile/main_img/main_logo.png" alt='로고'/>
                    </Link>
                </div>
                <div>
                    <ul className={styles["main_menu"]}>
                        <li><Link to="/storelist">메뉴</Link></li>
                        <li>
                            <Link to="/" state="">진행중인 공구</Link>
                        </li>
                        <li>랭킹</li>
                        <li>이벤트</li>
                    </ul>
                </div>
                <div className={styles["location"]}>
                    <div className={styles["location_gps"]}>
                        <button className={styles["location_btn"]} onClick={handleClick}>
                            <img className={styles["location_icon"]} src="http://localhost:8080/image/imgfile/main_img/location_icon_red.png" />
                        </button>
                        <div onClick={handleClick}>
                        {address || "주소를 입력하세요"}
                        </div>
{/*
                        {showMapModal && (
                            <div className={styles["modalStyle"]}>
                                <div className={styles["popupStyle"]} onClick={(e) => e.stopPropagation()}>
                                    <div style={{ textAlign: "center", marginTop: "15px" }}>
                                        <button
                                            className={styles["modal_btn"]}>
                                            확인
                                        </button>
                                        <button
                                            className={styles["modal_btn"]}>
                                            닫기
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )} */}
                    </div>
                </div>
                <div className={styles["main_hamburger"]}>
                    <button onClick={handleHamburgerClick} className={styles["main_hamburger_btn"]}>
                        <img
                            src="http://localhost:8080/image/imgfile/main_img/main_hamburger-md.png"
                            alt="햄버거 메뉴"
                        />
                    </button>
                </div>
            </div>
        </header>
    )
}