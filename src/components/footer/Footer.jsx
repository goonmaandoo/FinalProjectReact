import style from '../../CSS/Footer.module.css';
import { Link, useNavigate } from "react-router-dom";

export default function Footer() {
    return (
        <footer className={style.footer}>
            <div className={style['footer-inner']}>
                <div className={style['footer-links']}>
                    <Link to="/moapolicy1"> 배달모아 약관 </Link>
                    <Link to="/moapolicy2"> 모아페이 이용약관</Link>
                    <Link to="/moapolicy3"> 전자금융거래 이용약관</Link>
                    <Link to="/moapolicy4"> <strong>개인정보처리방침</strong> </Link>
                    <Link to="/safetyguide"> 안전거래 가이드 </Link>
                </div>

                <div className={style['footer-info']}>
                    <div className={style['footer-section']}>
                        <strong>배달모아(주)</strong><br />
                        대표이사 박수민 | 서울특별시 종로구, 대왕빌딩 9층<br />
                        전화 1234-1234 | 이메일 abcd@abcd.com
                    </div>

                    <div className={style['footer-section']}>
                        <strong>고객센터</strong><br />
                        전화 1234-1234 | <Link to="/mypage/myqna"> 1:1문의 바로가기</Link> 
                    </div>
                </div>

                <p className={style.copyright}>
                    © 2025 배달모아. All rights reserved.
                </p>
            </div>
        </footer>
    );
}
