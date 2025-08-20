import { useEffect, useState } from "react";
import axios from "axios";
import styles from "../../CSS/AuthQna.module.css";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import ArrowDropUpIcon from "@mui/icons-material/ArrowDropUp";

export default function AuthQna() {
    const [qnaList, setQnaList] = useState([]);
    const [writingId, setWritingId] = useState(null);
    const [answerWriting, setAnswerWriting] = useState(false);
    const [answer, setAnswer] = useState("");
    const [filter, setFilter] = useState("selectAll");
    const [viewId, setViewId] = useState("");

    // 페이지네이션
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5; // 한 페이지에 보여줄 주문 개수

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentQnaList = qnaList.slice(indexOfFirstItem, indexOfLastItem);

    const totalPages = Math.ceil(qnaList.length / itemsPerPage);
    const pageNumbers = [];
    for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
    }

    // 필터 고르기
    const handleFilterChange = (e) => {
        setFilter(e.target.value);
        setCurrentPage(1); // 필터 변경 시 첫 페이지로 이동
    };

    // 펼치기 버튼
    const openAnswer = (qnaId) => {
        setViewId(prev => (prev === qnaId ? null : qnaId));
    }

    // 필터 변경 시마다 API 호출하여 데이터 갱신
    useEffect(() => {
        let apiUrl = "/api/qna/selectAll";
        if (filter === "selectAllAnswer") apiUrl = "/api/qna/selectAllAnswer";
        else if (filter === "selectAllQna") apiUrl = "/api/qna/selectAllQna";

        axios
            .get(apiUrl)
            .then((response) => {
                setQnaList(response.data);
            })
            .catch((error) => {
                console.error("Qna 불러오기 실패:", error);
            });
    }, [filter]);

    // 답변 작성 시작
    const writeAnswer = (qnaId) => {
        setWritingId(qnaId);
        setAnswerWriting(true);
    };

    // writingId가 바뀌면 해당 QnA의 기존 답변 내용을 answer 상태에 세팅
    useEffect(() => {
        if (writingId !== null) {
            const currentQna = qnaList.find((q) => q.id === writingId);
            setAnswer(currentQna?.qanswer || "");
        }
    }, [writingId, qnaList]);

    // 답변 작성 완료 시
    const answerUpdate = async () => {
        try {
            await axios.put("/api/qna/updateAnswer", { id: writingId, qanswer: answer });
            alert("답변이 정상으로 등록되었습니다.");

            // 현재 filter 상태에 맞는 API 호출로 데이터 갱신
            let apiUrl = "/api/qna/selectAll";
            if (filter === "selectAllAnswer") apiUrl = "/api/qna/selectAllAnswer";
            else if (filter === "selectAllQna") apiUrl = "/api/qna/selectAllQna";

            const response = await axios.get(apiUrl);
            setQnaList(response.data);

            setAnswerWriting(false);
            setWritingId(null);
            setAnswer("");
        } catch (error) {
            console.error("답변 등록에 실패했습니다.", error);
            alert("답변 등록에 실패했습니다.");
        }
    };

    return (
        <>
            <div className={styles.AuthHeadContainer}>
                <div className={styles.headMain}>문의 내역</div>
                <div className={styles.headSub}>QnA문의 내역입니다.</div>
                <div className={styles.radioWrapper}>
                    <label>
                        <input
                            type="radio"
                            name="filter"
                            value="selectAll"
                            checked={filter === "selectAll"}
                            onChange={handleFilterChange}
                        />{" "}
                        전체
                    </label>
                    <label>
                        <input
                            type="radio"
                            name="filter"
                            value="selectAllAnswer"
                            checked={filter === "selectAllAnswer"}
                            onChange={handleFilterChange}
                        />{" "}
                        답변됨
                    </label>
                    <label>
                        <input
                            type="radio"
                            name="filter"
                            value="selectAllQna"
                            checked={filter === "selectAllQna"}
                            onChange={handleFilterChange}
                        />{" "}
                        미답변
                    </label>
                </div>
            </div>

            {currentQnaList.length > 0 ? (
                currentQnaList.map((qna) => (
                    <div className={styles.authQnaCard} key={qna.id}>
                        <div className={styles.authnQnatitle}>
                            <span>{qna.title}</span>
                            <div className={styles.authQnatitleRight}>
                                <span className={styles.qnaStatus}>아이디: {qna.userId}</span>
                                <span
                                    className={styles.answerStatus}
                                    style={{ background: qna.qanswer ? "#ff7272" : "#c3c3c3" }}
                                >
                                    {qna.qanswer ? "답변완료" : "미답변"}
                                </span>
                                <span
                                    className={styles.addAnswerBtn}
                                    onClick={() => writeAnswer(qna.id)}
                                >
                                    {qna.qanswer ? "답변수정" : "답변등록"}
                                </span>
                                {viewId === qna.id ? (
                                    <ArrowDropUpIcon className={styles.arrowIcon} onClick={() => openAnswer(qna.id)} />
                                ) : (
                                    <ArrowDropDownIcon className={styles.arrowIcon} onClick={() => openAnswer(qna.id)} />
                                )}
                            </div>
                        </div>
                        {viewId === qna.id && (
                            <div className={styles.authnQnaContents}>{qna.qContents}</div>
                        )}
                        {answerWriting && writingId === qna.id && (
                            <div className={styles.answerCard}>
                                <div className={styles.answerBody}>
                                    <textarea
                                        value={answer}
                                        onChange={(e) => setAnswer(e.target.value)}
                                        style={{ resize: "none" }}
                                    />
                                </div>
                                <div className={styles.completeWrapper}>
                                    <button
                                        className={styles.completeAnswerBtn}
                                        type="button"
                                        onClick={answerUpdate}
                                    >
                                        작성완료
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                ))
            ) : (
                <div className={styles.noQnaMessage}>
                    <p>문의내역이 없습니다.</p>
                </div>
            )}

            {totalPages > 1 && (
                <div className={styles["pagination"]}>
                    {pageNumbers.map(number => (
                        <button
                            key={number}
                            onClick={() => setCurrentPage(number)}
                            className={currentPage === number ? styles["active"] : ""}
                        >
                            {number}
                        </button>
                    ))}
                </div>
            )}
        </>
    );
}