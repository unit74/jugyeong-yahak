import React, { useCallback } from "react";
import styles from "./StudentMain.module.css";
import { useNavigate } from "react-router-dom";
import useTimeoutCallback from "../Common/hooks/useTimeoutCallback";

export default function StudentMain() {
  const navigate = useNavigate();

  const navigateToRecordDictation = useCallback((navigate) => {
    navigate("/review-theme");
  }, []);

  useTimeoutCallback(navigateToRecordDictation, 10000); // 10초

  return (
    <div className={styles.main}>
      <div className={styles.square}>
        <div className={styles.greeting}>
          <b className={styles.b}>👋🏻 김나연 님, 안녕하세요!</b>
        </div>
        {/*  */}
        <div className={styles.time}>
          <b className={styles.b2}>지금은</b>
          <b className={styles.b3}>혼자 학습</b>
          <b className={styles.b4}>시간</b>
        </div>
      </div>
    </div>
  );
}
