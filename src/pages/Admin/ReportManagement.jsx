import styles from "../../CSS/Admin/ReportManagement.module.css";
// import style from "../../CSS/Admin/AdminPage.module.css";
import { useState, useEffect, useMemo } from "react";
import axios from "axios";
import ReportManageCard from "./ReportManageCard.jsx";
import { useSelector } from "react-redux";

const PAGE_SIZE_OPTIONS = [10, 20, 50];

export default function ReportManagement() {
  // const [roomData, setRoomData] = useState([]);
  const adminId = useSelector((s) => s.auth.user?.id);
  const [items, setItems] = useState([]);
  const [total, setTotal] = useState(0);

  const [page, setPage] = useState(0);
  const [size, setSize] = useState(() => {
    const saved = Number(localStorage.getItem("report_page_size"));
    return PAGE_SIZE_OPTIONS.includes(saved) ? saved : 10;
  });

  //간단 필터
  const [filters, setFilters] = useState({
    status: "", //pending, resolved, rejected
    userId: "", //피신고자 ID
    reportedBy: "", //신고자 ID
    keyword: "", //사유 키워드
  });

  const totalPages = useMemo(
    () => Math.max(1, Math.ceil(total / size)),
    [total, size]
  );
  const start = total === 0 ? 0 : page * size + 1;
  const end = total === 0 ? 0 : Math.min((page + 1) * size, total);

  async function load(signal) {
    const params = {
      page,
      size,
      status: filters.status || undefined,
      userId: filters.userId || undefined,
      reportedBy: filters.reportedBy || undefined,
      keyword: filters.keyword || undefined,
    };
    const res = await axios.get("/api/chatReports/admin", { params, signal });
    //서버 응답 형식 : { items: [...], total: number }
    setItems(res.data.items ?? []);
    setTotal(res.data.total ?? 0);
  }

  useEffect(() => {
    const controller = new AbortController();
    load(controller.signal).catch((error) => {
      if (axios.isCancel(error)) return;
      console.error(error);
    });
    return () => controller.abort();
    //page/size/filters 변화에 반응
  }, [page, size, filters]);

  const onChangeSize = (v) => {
    const next = Number(v);
    setSize(next);
    localStorage.setItem("report_page_size", String(next));
    setPage(0); //페이지 초기화
  };

  // 신고 상태 변경 함수들
  async function progressReport(
    reportId,
    { action, days, targetUserId, adminComment }
  ) {
    try {
      if (action === "none") {
        // "무시"는 보통 반려로 처리
        await axios.patch(`/api/chatReports/${reportId}/reject`, null, {
          params: { adminId },
        });

        // (선택) adminComment 서버에 남기고 싶으면 별도 로그 API가 있어야 함.
        // await axios.post(`/api/admin/audit`, { reportId, adminComment, action: 'ignore' });
      } else if (action === "ban_days") {
        // 1) 신고 상태는 '처리완료'
        await axios.post(`/api/reports/ban`, {
          userId: targetUserId,
          days,
          reason: adminComment || "",
          adminId,
          reportId,
        });
        // 2) 밴 API가 있다면 여기에 호출 추가 (없으면 주석 유지)
        // await axios.post(`/api/users/${targetUserId}/ban-days`, { days }, { params: { adminId } });
        // 영구정지: days가 매우 크면 서버에서 perm-ban으로 처리하도록 구현 권장
      } else {
        console.warn("Unknown action:", action);
      }

      // 성공 후 목록 갱신
      await load();
    } catch (e) {
      console.error(e);
      alert("신고 처리 중 오류가 발생했습니다.");
    }
  }

  const handleReject = (report) =>
    progressReport(report.id, {
      adminComment: "주의(무시 처리)",
      action: "none",
      targetUserId: report.userId,
    });

  const handleTempBan = (report, days) =>
    progressReport(report.id, {
      adminComment: `${days}일 임시 제한`,
      action: "ban_days",
      days,
      targetUserId: report.userId,
    });

  const handlePermanentBan = (report) =>
    progressReport(report.id, {
      adminComment: "영구 정지",
      action: "ban_days",
      days: 365000, // 서버에서 perm-ban으로 전환 처리 권장
      targetUserId: report.userId,
    });

  const handleSearch = () => setPage(0);

  return (
    <div className={styles.page}>
      <div className={styles.wrap}>
        <header className={styles.header}>
          <h1>신고관리</h1>
          <p>사용자 신고를 조회·처리합니다.</p>
        </header>

        {/* 필터 바 */}
        <div className={styles.toolbar}>
          <div className={styles.filters}>
            <label className={styles.filterItem}>
              <span>상태</span>
              <select
                value={filters.status}
                onChange={(e) =>
                  setFilters((s) => ({ ...s, status: e.target.value }))
                }
              >
                <option value="">전체</option>
                <option value="pending">미응답</option>
                <option value="in_progress">처리중</option>
                <option value="resolved">처리완료</option>
                <option value="rejected">반려</option>
              </select>
            </label>

            <label className={styles.filterItem}>
              <span>피신고자ID</span>
              <input
                value={filters.userId}
                onChange={(e) =>
                  setFilters((s) => ({ ...s, userId: e.target.value }))
                }
                placeholder="예) 123"
              />
            </label>

            <label className={styles.filterItem}>
              <span>신고자ID</span>
              <input
                value={filters.reportedBy}
                onChange={(e) =>
                  setFilters((s) => ({ ...s, reportedBy: e.target.value }))
                }
                placeholder="예) 45"
              />
            </label>

            <label className={`${styles.filterItem} ${styles.filterGrow}`}>
              <span>키워드</span>
              <input
                value={filters.keyword}
                onChange={(e) =>
                  setFilters((s) => ({ ...s, keyword: e.target.value }))
                }
                placeholder="사유 검색"
              />
            </label>

            <button
              className={`${styles.btn} ${styles.btnOutline}`}
              onClick={handleSearch}
            >
              검색
            </button>
          </div>

          <div className={styles.rightControls}>
            <label className={styles.sizeSel}>
              <span>페이지당</span>
              <select
                value={size}
                onChange={(e) => onChangeSize(e.target.value)}
              >
                {PAGE_SIZE_OPTIONS.map((n) => (
                  <option key={n} value={n}>
                    {n}개
                  </option>
                ))}
              </select>
            </label>
            <div className={styles.range}>
              {start}-{end} / {total}
            </div>
          </div>
        </div>

        {/* 리스트 영역 */}
        <div className={styles.list}>
          {items.length === 0 ? (
            <div className={styles.empty}>데이터가 없습니다.</div>
          ) : (
            items.map((r) => (
              <ReportManageCard
                key={r.id}
                report={{
                  id: r.id,
                  userId: r.userId,
                  targetNickname: r.targetNickname,
                  targetState: r.targetState ?? "active",
                  reporterNickname: r.reporterNickname,
                  reportedAt: r.createdAt,
                  responseStatus: r.responseStatus ?? "pending",
                  chatPreview: r.chatPreview,
                  reason: r.reason,
                  roomNo: r.roomNo,
                }}
                onReject={handleReject}
                onTempBan={handleTempBan}
                onPermanentBan={handlePermanentBan}
              />
            ))
          )}
        </div>

        {/* 페이지네이션 */}
        <div className={styles.pager}>
          <button
            className={styles.pagerBtn}
            onClick={() => setPage(0)}
            disabled={page === 0}
          >
            « 처음
          </button>
          <button
            className={styles.pagerBtn}
            onClick={() => setPage((p) => Math.max(0, p - 1))}
            disabled={page === 0}
          >
            ‹ 이전
          </button>

          <span className={styles.pagerPage}>
            {page + 1} / {totalPages}
          </span>

          <button
            className={styles.pagerBtn}
            onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
            disabled={page + 1 >= totalPages}
          >
            다음 ›
          </button>
          <button
            className={styles.pagerBtn}
            onClick={() => setPage(totalPages - 1)}
            disabled={page + 1 >= totalPages}
          >
            끝 »
          </button>
        </div>
      </div>
    </div>
  );
}
