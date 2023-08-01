import React, { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./StudentDictationAnswer.module.css";
import useTimeoutCallback from "../Common/hooks/useTimeoutCallback";

// 예시영상 페이지
export default function StudentDictationAnswer() {
  const navigate = useNavigate();

  const navigateToRecordDictation = useCallback((navigate) => {
    navigate("/good-feedback"); // 피드백 다시 연결 필요
  }, []);

  useTimeoutCallback(navigateToRecordDictation, 10000); // 10초

  return (
    <div className={styles.main}>
      <div className={styles.square}>
        <div className={styles.theme}>
          {/*  */}

          <p>ocr 연결 ~~</p>
        </div>
      </div>
    </div>
  );
}
