import styles from '../../CSS/ReportManagement.module.css';
import style from '../../CSS/AdminPage.module.css';
import { useState, useEffect } from 'react';

export default function ReportManagement1() {
    const [roomData, setRoomData] = useState([]);

    return (
        <>
            <div>
                <div className={style["side_menu_box"]}>
                    <div className={style["side_title"]}>신고관리</div>
                </div>
                <div className={style["side_detail"]}>사용자 신고와 문의사항을 처리하세요</div>
            </div>
            <div className={styles["store_box"]}>
                <div className={styles["total"]}>
                    <div className={styles["total_third"]}>
                        <div>신고번호</div>
                        <div>1242342352</div>
                    </div>
                    <div className={styles["total_third"]}>
                        <div>신고대상 : 닉네임</div>
                    </div>
                </div>
                <div className={styles["total1"]}>
                    <div>
                        <div>신고자:너굴맨</div>
                        <div>신고일시 : 2000.05.4534</div>
                    </div>
                    <div className={styles["report_status"]}>미응답</div>
                    <button>펼치기</button>
                </div>
            </div>
        </>
    )
}