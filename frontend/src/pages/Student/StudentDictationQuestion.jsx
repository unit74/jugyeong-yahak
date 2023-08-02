import React, { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./StudentDictationQuestion.module.css";
import useTimeoutCallback from "../Common/hooks/useTimeoutCallback";

// 예시영상 페이지
export default function StudentDictationQuestion() {
  const navigate = useNavigate();

  const navigateToRecordDictation = useCallback((navigate) => {
    navigate("/dictation-answer");
  }, []);

  useTimeoutCallback(navigateToRecordDictation, 10000); // 10초

  return (
    <div className={styles.main}>
      <div className={styles.square}>
        <div className={styles.theme}>
          {/*  */}

          <p>받아쓰기 문제 보여주자</p>
        </div>
      </div>
    </div>
  );
}
