import React, { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./StudentDictationMain.module.css";
import useTimeoutCallback from "../Common/hooks/useTimeoutCallback";

export default function StudentDictationMain() {
  const navigate = useNavigate();

  const navigateToRecordDictation = useCallback((navigate) => {
    navigate("/dictation-video");
  }, []);
  useTimeoutCallback(navigateToRecordDictation, 10000); // 10초

  return (
    <div className={styles.main}>
      <div className={styles.square}>
        <div className={styles.theme}>
          {/*  */}
          <p>받아쓰기 안내 메인페이지</p>
        </div>
      </div>
    </div>
  );
}
