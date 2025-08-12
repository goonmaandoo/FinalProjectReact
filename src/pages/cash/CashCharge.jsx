import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import styles from "../../CSS/CashCharge.module.css";

export default function CashCharge() {
  const token = useSelector((state) => state.auth?.token);

  const [cash, setCash] = useState(0); //현재 보유 캐쉬
  const [error, setError] = useState(null);
  const [amount, setAmount] = useState(""); //충전 입력값

  const presetAmounts = [10000, 50000, 100000, 500000];

  //캐쉬 조회
  useEffect(() => {
    if (!token) return;
    axios
      .get("/api/users/cash", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setCash(res.data))
      .catch((e) => setError(e.response?.data || "조회 실패"));
  }, [token]);

  //프리셋 금액 추가
  const addPreset = (v) => {
    setAmount(String(Number(amount || 0) + v));
  };

  //충전 처리
  const handleCharge = async () => {
    const a = parseInt(amount || "0", 10);
    if (!token) return alert("로그인 후 이용해주세요.");
    if (!a || a < 1000) return alert(`최소 충전 금액은 1,000원입니다.`);

    try {
      await axios.post(
        "/api/users/cash/charge",
        { cash: a },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("충전 완료!");

      // 부모창에 통지 후 잔액 갱신 유도
      if (window.opener && !window.opener.closed) {
        window.opener.postMessage(
          { type: "CASH_CHARGED", amount: a },
          window.location.origin
        );
      }

      // 팝업 닫기 (팝업으로 열렸을 때만 동작)
      window.close();
    } catch (e) {
      console.error(e);
      alert(e.response?.data || "충전 실패");
    }
  };

  return (
    <div className={styles.wrapper}>
      {/* 상단 타이틀 */}
      <div className={styles.headerRow}>
        <button className={styles.backButton} onClick={() => window.close()}>
          &larr;
        </button>
        <h2 className={styles.title}>캐시 충전</h2>
        <span className={styles.reserve}>배달모아</span>
      </div>
      {/* 안내문구 */}
      <div className={styles.guide}>충전할 금액을 입력해 주세요.</div>

      {/* 프리셋 버튼 */}
      <div className={styles.presetRow}>
        {presetAmounts.map((v) => (
          <button
            type="button"
            key={v}
            className={styles.presetButton}
            onClick={() => addPreset(v)}
          >
            +{v >= 10000 ? v / 10000 + "만" : v.toLocaleString()}
          </button>
        ))}
      </div>

      {/* 금액 입력 */}
      <input
        type="number"
        value={amount}
        onChange={(e) => setAmount(e.target.value.replace(/[^0-9]/g, ""))}
        placeholder="충전할 금액"
        className={styles.amountInput}
        min={1000}
      />

      {/* 현재 캐시 */}
      <div
        style={{
          marginBottom: 20,
          fontWeight: 500,
          color: "#174C4F",
          fontSize: 16,
        }}
      >
        현재 보유 캐시:{" "}
        <span style={{ color: "#FF6B6B" }}>{cash.toLocaleString()} 원</span>
      </div>

      {/* 충전 버튼 */}
      <button
        className={styles.chargeButton}
        disabled={!amount || parseInt(amount, 10) <= 0}
        onClick={handleCharge}
      >
        충전하기
      </button>
    </div>
  );
}
