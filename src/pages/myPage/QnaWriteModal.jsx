import React, { useEffect, useState } from "react";
import styles from "../../CSS/QnaWriteModal.module.css";

export default function QnaWriteModal({ open, onClose, onSubmit, userId }) {
  const [title, setTitle] = useState("");
  const [contents, setContents] = useState("");

  //Modal 열때마다 초기화.
  useEffect(() => {
    if (open) {
      setTitle("");
      setContents("");
    }
  }, [open]);

  if (!open) return null;

  const handleInsert = () => {
    if (!title || !contents) {
      alert("제목과 내용을 입력해주세요.");
      return;
    }

    const newQna = {
      userId: userId,
      title: title,
      qContents: contents,
    };

    onSubmit(newQna);
    onClose(); //모달 닫기
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <h2>문의 등록</h2>

        <div className={styles.editTitle}>
          <input
            className={styles.titleInput}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="제목을 입력하세요"
          />
        </div>

        <div>
          <textarea
            className={styles.contentsInput}
            value={contents}
            onChange={(e) => setContents(e.target.value)}
            placeholder="내용을 입력하세요"
          />
        </div>

        <div className={styles.buttons}>
          <button className={styles.saveButton} onClick={handleInsert}>
            등록
          </button>
          <button className={styles.cansleButton} onClick={onClose}>
            취소
          </button>
        </div>
      </div>
    </div>
  );
}
