import React from "react";
import styles from "./StudentLive.module.css";

// 학생 라이브
// 근데 오픈비두 이식하면 또 바뀔듯....
export default function StudentLive() {
  // 함수, 변수 정의부분

  // 태그 생성부분
  return (
    <div className={styles.main}>
      <div className={styles.square}>
        <div className={styles.time}></div>
      </div>
    </div>
  );
}
