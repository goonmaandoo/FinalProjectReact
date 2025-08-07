import React, { useState } from "react";
import CanWriteReviewList from "./CanWriteReviewList";
import MyReviewList from "./MyReviewList";

export default function MyReview() {
  const [tab, setTab] = useState("canWrite"); // 'canWrite' or 'myReview'

  return (
    <div style={{ maxWidth: 700, margin: "0 auto", padding: 20 }}>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          marginBottom: 24,
          gap: 10,
        }}
      >
        <button
          style={{
            padding: "10px 24px",
            borderRadius: 20,
            border: "none",
            background: tab === "canWrite" ? "#19CE60" : "#eee",
            color: tab === "canWrite" ? "#fff" : "#333",
            fontWeight: tab === "canWrite" ? "bold" : "normal",
            cursor: "pointer",
          }}
          onClick={() => setTab("canWrite")}
        >
          작성 가능한 리뷰
        </button>
        <button
          style={{
            padding: "10px 24px",
            borderRadius: 20,
            border: "none",
            background: tab === "myReview" ? "#19CE60" : "#eee",
            color: tab === "myReview" ? "#fff" : "#333",
            fontWeight: tab === "myReview" ? "bold" : "normal",
            cursor: "pointer",
          }}
          onClick={() => setTab("myReview")}
        >
          내가 쓴 리뷰
        </button>
      </div>
      <div>
        {tab === "canWrite" && <CanWriteReviewList />}
        {tab === "myReview" && <MyReviewList />}
      </div>
    </div>
  );
}
