import styles from "../../CSS/Admin/StoreManagement.module.css";
import style from "../../CSS/Admin/AdminPage.module.css";
import styles2 from "../../CSS/Admin/ReviewAdmin.module.css";
import { useState, useEffect, useMemo } from "react";
import axios from "axios";

export default function ReviewAdmin() {
  const [subReviewBtn, setSubReviewBtn] = useState("all");
  const [counts, setCounts] = useState({});
  const [rows, setRows] = useState([]);
  const [page, setPage] = useState(1);
  const [size, setSize] = useState(10);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState(null);

  // 탭 -> 상태값 (공개 / 비공개 / 임시제한)
  const statusFilter = useMemo(() => {
    if (subReviewBtn === "ban") return "비공개";
    if (subReviewBtn === "stop") return "임시제한";
    return undefined; //all
  }, [subReviewBtn]);

  //개수 불러오기
  useEffect(() => {
    (async () => {
      try {
        const res = await axios.get("/api/admin/reviewadmin/counts");
        setCounts(res.data || {});
      } catch (e) {
        console.error(e);
      }
    })();
  }, []);

  //목록 불러오기
  useEffect(() => {
    (async () => {
      setLoading(true);
      setErr(null);
      try {
        const res = await axios.get("/api/admin/reviewadmin", {
          params: {
            page,
            size,
            ...(statusFilter ? { status: statusFilter } : {}),
          },
          headers: { Accept: "application/json" },
        });
        setRows(res.data?.content ?? []);
        setTotal(res.data?.total ?? 0);
      } catch (e) {
        setErr(e.message || "에러");
      } finally {
        setLoading(false);
      }
    })();
  }, [page, size, statusFilter]);

  //시간 정제
  const fmtDateTime = (iso) => {
    if (!iso) return "";
    try {
      const d = new Date(iso);
      return d.toLocaleString("ko-KR", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false,
        timeZone: "Asia/Seoul",
      });
    } catch {
      return iso;
    }
  };

  // 목록/카운트 갱신
  const refetch = async () => {
    //목록
    await axios
      .get("/spi/admin/reviewadmin", {
        params: {
          page,
          size,
          ...(statusFilter ? { status: statusFilter } : {}),
        },
        headers: { Accept: "application/json" },
      })
      .then((res) => {
        setRows(res.data?.content ?? []);
        setTotal(res.data?.total ?? 0);
      })
      .catch((e) => {
        setErr(e.message || "에러");
      });

    //카운트
    await axios
      .get("/api/admin/reviewadmin/counts", { params: {} })
      .then((res) => setCounts(res.data || {}))
      .catch(console.error);
  };

  // 상태 변경
  const onChangeStatus = async (id, next) => {
    try {
      await axios.patch(
        `/api/admin/reviewadmin/${id}/status`,
        { status: next },
        {
          headers: {
            "Content=Type": "application/json",
            Accept: "application/json",
          },
        }
      );
      await refetch();
    } catch (e) {
      alert(e?.response?.data?.message || e.message || "상태 변경 실패");
    }
  };

  // 삭제
  const onDelete = async (id) => {
    if (!window.confirm("정말 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다."))
      return;
    try {
      await axios.delete(`/api/admin/reviewadmin/${id}`, {
        headers: { Accept: "application/json" },
      });
      await refetch();
    } catch (e) {
      alert(e?.response?.data?.message || e.message || "삭제 실패");
    }
  };

  const totalPages = Math.max(1, Math.ceil(total / size));

  return (
    <>
      {/* 사이드 메뉴 */}
      <div>
        <div className={style["side_menu_box"]}>
          <div className={style["side_title"]}>댓글관리</div>
          <div className={style["side_btn"]}>
            <button
              className={
                subReviewBtn === "all"
                  ? style["active_btn"]
                  : style["unactive_btn"]
              }
              onClick={() => {
                setSubReviewBtn("all");
                setPage(1);
              }}
            >
              전체
            </button>
            <button
              className={
                subReviewBtn === "ban"
                  ? style["active_btn"]
                  : style["unactive_btn"]
              }
              onClick={() => {
                setSubReviewBtn("ban");
                setPage(1);
              }}
            >
              숨김
            </button>
            <button
              className={
                subReviewBtn === "stop"
                  ? style["active_btn"]
                  : style["unactive_btn"]
              }
              onClick={() => {
                setSubReviewBtn("stop");
                setPage(1);
              }}
            >
              신고
            </button>
          </div>
        </div>
        <div className={style["side_detail"]}>
          공구방과 음식점 리뷰 댓글을 관리하세요
        </div>
      </div>

      {/* 카운트 박스 */}
      {subReviewBtn !== "all" ? (
        <div className={styles["store_box"]}>
          <div className={styles["total_third"]}>
            <div className={styles["total_title"]}>
              {subReviewBtn === "ban" ? "숨긴 댓글" : "신고된 댓글"}
            </div>
            <div className={styles["total_num"]}>
              {subReviewBtn === "ban"
                ? counts["비공개"] ?? "?"
                : counts["임시제한"] ?? "?"}
            </div>
          </div>
          <img
            src={`https://s3.us-east-1.amazonaws.com/delivery-bucket2025.08/imgfile/admin/${subReviewBtn}_review.png`}
          />
        </div>
      ) : (
        <>
          <div className={styles["store_box"]}>
            <div className={styles["total_third"]}>
              <div className={styles["total_title"]}>총 댓글수</div>
              <div className={styles["total_num"]}>
                {counts["TOTAL"] ?? "?"}
              </div>
            </div>
            <img
              src={`https://s3.us-east-1.amazonaws.com/delivery-bucket2025.08/imgfile/admin/total_review.png`}
            />
          </div>
          <div className={styles["store_box"]}>
            <div className={styles["total_third"]}>
              <div className={styles["total_title"]}>숨긴 댓글</div>
              <div className={styles["total_num"]}>
                {counts["비공개"] ?? "?"}
              </div>
            </div>
            <img
              src={`https://s3.us-east-1.amazonaws.com/delivery-bucket2025.08/imgfile/admin/ban_review.png`}
            />
          </div>
          <div className={styles["store_box"]}>
            <div className={styles["total_third"]}>
              <div className={styles["total_title"]}>신고된 댓글</div>
              <div className={styles["total_num"]}>
                {counts["임시제한"] ?? "?"}
              </div>
            </div>
            <img
              src={`https://s3.us-east-1.amazonaws.com/delivery-bucket2025.08/imgfile/admin/stop_review.png`}
            />
          </div>
        </>
      )}

      {/* 댓글 리스트 */}
      <section style={{ marginTop: 24 }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 12,
          }}
        >
          <h3 style={{ margin: 0 }}>
            {subReviewBtn === "all"
              ? "전체 댓글"
              : subReviewBtn === "ban"
              ? "숨긴 댓글"
              : "신고된 댓글"}
          </h3>
          <div className={styles2.page_size_wrap}>
            <label className={styles2.page_size_label}>페이지당</label>
            <select
              className={styles2.page_size_select}
              value={size}
              onChange={(e) => {
                setSize(Number(e.target.value));
                setPage(1);
              }}
            >
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={50}>50</option>
            </select>
          </div>
        </div>

        {loading ? (
          <div>불러오는 중...</div>
        ) : err ? (
          <div style={{ color: "crimson" }}>에러: {err}</div>
        ) : rows.length === 0 ? (
          <div>데이터가 없습니다.</div>
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table className={styles2.review_table}>
              <thead>
                <tr>
                  <th>리뷰ID</th>
                  <th>작성자</th>
                  <th>가게</th>
                  <th>별점</th>
                  <th>내용</th>
                  <th>상태</th>
                  <th>작성일</th>
                  <th>액션</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((r) => (
                  <tr key={r.id}>
                    <td>{r.id}</td>
                    <td>{r.nickname}</td>
                    <td>{r.storeName}</td>
                    <td>{r.score}</td>
                    <td>{r.comments}</td>
                    <td>{r.status}</td>
                    <td>{fmtDateTime(r.createdAt)}</td>
                    <td>
                      <button
                        className={`${styles2.btn_action} ${styles.btn_success}`}
                        onClick={() => onChangeStatus(r.id, "공개")}
                        disabled={r.status !== "임시제한"}
                      >
                        공개
                      </button>
                      <button
                        className={`${styles2.btn_action} ${styles.btn_success}`}
                        onClick={() => onDelete(r.id)}
                        disabled={r.status !== "임시제한"}
                      >
                        삭제
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* 페이지네이션 */}
        <div className={styles2.pagination}>
          <button
            className={styles2.page_btn}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page <= 1}
          >
            ◀ 이전
          </button>
          <span className={styles2.page_info}>
            {page} / {totalPages}
          </span>
          <button
            className={styles2.page_btn}
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page >= totalPages}
          >
            다음 ▶
          </button>
        </div>
      </section>
    </>
  );
}
