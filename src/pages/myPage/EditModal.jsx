import { useState, useEffect } from "react";
import styles from '../../CSS/EditModal.module.css';
import axios from "axios";
import FormattedDate from "../../component/funtion/common/FormattedDate";

export default function EditModal({ qnaId, onClose }) {
    const [qna, setQna] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const [title, setTitle] = useState('');
    const [contents, setContents] = useState('');
    const [date, setDate] = useState('');
    useEffect(() => {
        axios.get(`/api/qna/getTheQna/${qnaId}`).then((response) => {
            console.log(response.data);
            setQna(response.data);
            setTitle(response.data.title);
            setContents(response.data.qcontents);
            setDate(response.data.createdAt);
        }).catch((err) => {
            console.error(err);
            setError('불러오기 실패');
        }).finally(() => {
            setLoading(false);
        })
    }, [qnaId])

    const handleUpdate = async () => {
        console.log("title:"+ title);
        console.log("id:"+ qnaId);
        console.log("qcontents"+ contents);
        try {
            const updatedData = {
                id: qnaId,
                title: title,
                qcontents: contents
            };
            console.log("updatedData:", updatedData);
            const response = await axios.put("/api/qna/updateQna", updatedData);
            alert("수정이 완료되었습니다.");
            onClose();
        } catch (error) {
            console.error("수정 실패", error);
            alert("문의 수정에 실패했습니다.");
        }
    };

    return (
        <div className={styles.overlay}>
            <div className={styles.modal}>
                <div className={styles.qnaUpdate}>문의 수정</div>
                {loading ? (
                    <b>로딩중입니다...</b>
                ) : (
                    <>
                        <div className={styles.qnaDate}>
                            <FormattedDate dateString={date} />
                        </div>

                        <div className={styles.editTitle}>
                            <b>Q. </b>
                            <input
                                className={styles.titleInput}
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                            />
                        </div>

                        <div>
                            <textarea
                                className={styles.contentsInput}
                                value={contents}
                                onChange={(e) => setContents(e.target.value)}
                                style={{ resize: 'none' }}
                            />
                        </div>

                        <div className={styles.buttons}>
                            <button className={styles.saveButton} onClick={handleUpdate}>
                                저장
                            </button>
                            <button className={styles.cansleButton} onClick={onClose}>
                                취소
                            </button>
                        </div>
                    </>
                )}
            </div>
        </div>

    )
}