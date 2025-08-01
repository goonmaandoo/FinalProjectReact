import { useEffect, useState } from "react"
import axios from "axios";

export default function AuthQna() {
    const [qnaList, setQnaList] = useState([]);
    const [writingId, setWritingId] = useState(null);
    const [answerWriting, setAnswerWriting] = useState(false);
    const [answer, setAnswer] = useState(null);
    // 답글 없는 문의 보기
    useEffect(() => {
        axios.get("/api/qna/selectAllQna").then(response => {
            console.log("호출 데이터:", response.data);
            setQnaList(response.data);
        }).catch(error => {
            console.error("Qna 불러오기 실패:", error);
        });
    }, []);
    const writeAnswer = (qnaId) => {
        alert('답글달기');
        setWritingId(qnaId);
        setAnswerWriting(true);
    }
    // 문의 작성완료
    const answerUpdate = async () => {
        try {
            const updateData = {
                id: writingId,
                qanswer: answer,
            };
            const response = await axios.put("/api/qna/updateAnswer", updateData);
            alert("답변이 정상으로 등록되었습니다.");

            // ✅ API를 다시 호출하여 qnaList 상태 업데이트
            axios.get("/api/qna/selectAllQna").then(response => {
                setQnaList(response.data);
            });

            setAnswerWriting(false);
            setWritingId(null);
            setAnswer(null);

        } catch (error) {
            console.error("답변 등록에 실패했습니다.", error);
            alert("답변 등록에 실패했습니다.");
        }
    };
    return (
        <>
            <div>관리자 문의 수정</div>
            <ul>
                {qnaList.map(qna => (
                    <div key={qna.id}>
                        <div>문의 제목: {qna.title}</div>
                        <div>문의 내용: {qna.qcontents}</div>
                        <button onClick={() => writeAnswer(qna.id)}>답글 달기</button>

                        {(answerWriting && writingId === qna.id) ? (
                            <div>
                                <div>답글</div>
                                <textarea
                                    value={answer || ""}
                                    onChange={(e) => setAnswer(e.target.value)}
                                />
                                <button type="button" onClick={answerUpdate}>작성완료</button>
                            </div>
                        ) : <b>바보</b>}
                    </div>
                ))}
            </ul>
        </>
    )
}