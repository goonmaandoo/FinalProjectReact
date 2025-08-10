import styles from '../../CSS/ReportManagement.module.css';
import { useState, useEffect } from 'react';

export default function ReportManagement() {
    const [roomData, setRoomData] = useState([]);

    return (
        <>  
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