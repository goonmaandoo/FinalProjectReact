import styles from '../../CSS/MainHeader.module.css'
import { Link } from "react-router-dom";

export default function MainHeader({ toggleMenu }) {
    
    const handleHamburgerClick = (e) => {
        e.stopPropagation();
        toggleMenu(e);
    }

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