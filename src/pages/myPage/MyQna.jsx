import { useState, useEffect } from "react";
import styles from "../../CSS/MyPage.module.css";
import axios from "axios";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import EditModal from "./EditModal";
import QnaWriteModal from "./QnaWriteModal";

export default function MyQna() {
  const [qnaList, setQnaList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(0);

  const userId = 1;
  useEffect(() => {
    axios
      .get("/api/qna/getQnaList", {
        params: { userId },
      })
      .then((response) => {
        console.log(response.data);
        setQnaList(response.data);
        console;
        setCurrentPage(0);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setError("불러오기 실패");
        setLoading(false);
      });
  }, []);
  useEffect(() => {
    console.log("🔥 qnaList 상태가 변경됨:", qnaList);
  }, [qnaList]);
  // 빈배열 userId로 추후 변경

  // 문의 CRUD
  // 문의 등록
  const handleInsert = async (newQna) => {
    try {
      await axios.post("/api/qna/insertQna", newQna);
      alert("문의가 등록됐습니다.");
      const response = await axios.get("/api/qna/getQnaList",
        {params: { userId },
      });
      setQnaList(response.data);
    } catch (error) {
      console.error("등록 실패", error);
      alert("예기치 못한 오류로 문의 등록을 하지 못했습니다.");
    }
  };

  // 문의 수정
  const [editQnaById, setEditQnaById] = useState(null);
  const [editing, setEditing] = useState(false);
  const editStart = (qna) => {
    const confirmed = window.confirm("문의를 수정하시겠습니까?");
    if (!confirmed) return;
    setEditQnaById(qna.id);
    setEditing(true);
  };
  // 모달 열기
  const [modalOpen, setModalOpen] = useState(false);
  // 문의 수정 모달 닫기
  const closeModal = () => {
    setEditing(false);
    setEditQnaById(null);
  };
  // 문의 삭제
  const reviewDelete = async (qnaId) => {
    const confirmed = window.confirm("문의를 삭제하시겠습니까?");
    console.log("qnaId:" + qnaId);
    if (!confirmed) return;

    try {
      await axios.delete(`/api/qna/${qnaId}`);
      alert("문의가 삭제되었습니다.");
      setQnaList((prevList) => prevList.filter((qna) => qna.id !== qnaId));
    } catch (error) {
      console.error("삭제 실패", error);
      alert("문의 삭제에 실패했습니다.");
    }
  };
  // 답변 보기
  const [showAnswerId, setShowAnswerId] = useState(null);
  const toggleAnswer = (id) => {
    setShowAnswerId((prev) => (prev === id ? null : id));
  };
  // 페이지 네이션
  const itemsPerPage = 3;
  const paginatedQna = qnaList.slice(
    currentPage * itemsPerPage,
    (currentPage + 1) * itemsPerPage
  );
  const totalPages = Math.ceil(qnaList.length / itemsPerPage);

  return (
    <>
      <div className={styles.qnaButtonWrapper}>
        <button
          className={styles.qnaWriteBtn}
          onClick={() => setModalOpen(true)}
        >
          문의 남기기
        </button>
      </div>
      <QnaWriteModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleInsert}
        userId={userId}
      />
      {loading ? (
        <>
          {Array.from({ length: itemsPerPage }).map((_, i) => (
            <div key={i} className={styles.qnaSkeletonCard}>
              <div className={`${styles.qnaSkeletonBox} ${styles.qnaLong}`} />
              <div className={`${styles.qnaSkeletonBox} ${styles.qnaMedium}`} />
              <div className={`${styles.qnaSkeletonBox} ${styles.qnaShort}`} />
            </div>
          ))}
        </>
      ) : paginatedQna.length === 0 ? (
        <p>문의 내역이 없습니다.</p>
      ) : (
        paginatedQna.map((qna) => (
          <div key={qna.id} className={styles.myQna}>
            <div className={styles.qnaDate}>{qna.createdAt}</div>
            <div className={styles.qnaTitle}>
              <b>Q. {qna.title}</b>
              <div className={styles.qnaContent}>
                <textarea
                  className={styles.qnaTextArea}
                  disabled
                  value={qna.qContents}
                />
              </div>
              <div className={styles.qnaanswer}>
                답변유무 {qna.qanswer ? "Yes" : "No"}
              </div>
              <div
                style={qna.qanswer ? { cursor: "pointer" } : {}}
                onClick={() => toggleAnswer(qna.id)}
              >
                <button
                  className={styles.deleteReview}
                  onClick={(e) => {
                    e.stopPropagation();
                    reviewDelete(qna.id);
                  }}
                >
                  리뷰삭제
                </button>
                {qna.qanswer ? (
                  ""
                ) : (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      editStart(qna);
                    }}
                    className={styles.editReview}
                  >
                    수정하기
                  </button>
                )}
                {qna.qanswer ? (
                  <ArrowDropDownIcon className={styles.downIcon} />
                ) : (
                  ""
                )}
              </div>
            </div>
            {qna.qanswer && showAnswerId === qna.id && (
              <div className={styles.answer}>
                <b>A.</b>
                <h4>{qna.qanswer}</h4>
              </div>
            )}
          </div>
        ))
      )}

      {totalPages > 1 && (
        <div className={styles.qnaPages}>
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 0))}
            disabled={currentPage === 0}
          >
            이전
          </button>

          {Array.from({ length: totalPages }).map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentPage(i)}
              className={i === currentPage ? styles.activePage : ""}
            >
              {i + 1}
            </button>
          ))}

          <button
            onClick={() =>
              setCurrentPage((prev) => Math.min(prev + 1, totalPages - 1))
            }
            disabled={currentPage === totalPages - 1}
          >
            다음
          </button>
        </div>
      )}
      {editing && editQnaById && (
        <EditModal qnaId={editQnaById} onClose={closeModal} />
      )}
    </>
  );
}
