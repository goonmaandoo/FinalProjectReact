import style from '../../CSS/Footer.module.css';

export default function Footer() {
    return (
        <footer className={style.footer}>
            <div className={style['footer-inner']}>
                <div className={style['footer-links']}>
                    <a href="#">배달모아 약관</a>
                    <a href="#">모아페이 이용약관</a>
                    <a href="#">전자금융거래 이용약관</a>
                    <a href="#"><strong>개인정보처리방침</strong></a>
                    <a href="#">안전거래 가이드</a>
                    <a href="#">쇼핑&페이 고객센터</a>
                </div>

                <div className={style['footer-info']}>
                    <div className={style['footer-section']}>
                        <strong>배달모아(주)</strong><br />
                        대표이사 박수민 | 서울특별시 종로구, 대왕빌딩 9층<br />
                        전화 1234-1234 | 이메일 abcd@abcd.com
                    </div>

                    <div className={style['footer-section']}>
                        <strong>고객센터</strong><br />
                        전화 1234-1234 | 1:1문의 바로가기
                    </div>
                </div>

                <p className={style.copyright}>
                    © 2025 배달모아. All rights reserved.
                </p>
            </div>
        </footer>
    );
}
