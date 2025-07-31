import style from '../../CSS/Footer.module.css'

export default function Footer() {

    return (
        <footer className={style['footer']}>
            <table className={style['footer_table']}>
                <tbody>
                    <tr>
                        <th>배달모아</th>
                        <th>고객센터</th>
                        <th>사업자정보</th>
                    </tr>
                    <tr>
                        <td>서비스 소개</td>
                        <td>1:1 문의</td>
                        <td>회사 소개</td>
                    </tr>
                    <tr>
                        <td>이용 방법</td>
                        <td>카카오톡 채널</td>
                        <td>이용약관</td>
                    </tr>
                    <tr>
                        <td>공지사항</td>
                        <td>이메일 문의</td>
                        <td>개인정보처리방침</td>
                    </tr>
                    <tr>
                        <td>자주 묻는 질문</td>
                        <td>전화 문의</td>
                        <td>위치기반서비스이용약관</td>
                    </tr>
                </tbody>
            </table>
            <p className={style['copyright']}>© 2025 배달모아. All rights reserved.</p>
        </footer>
    );
}