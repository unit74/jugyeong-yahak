import React, { useCallback, useState } from "react";
import styles from "./StudentBook.module.css";
import { useLocation, useNavigate } from "react-router-dom";
import useTimeoutCallback from "../Common/hooks/useTimeoutCallback";

export default function StudentBook() {
  const navigate = useNavigate();
  const [fade, setFade] = useState(false);

  // const navigateToRecordDictation = useCallback(() => {
  //   setFade(true);
  //   setTimeout(() => {
  //     navigate("/");
  //   }, 1000); // fadeout 후 이동
  // }, [navigate]);

  // useTimeoutCallback(navigateToRecordDictation, 15000); // 10초

  return (
    <div className={`${styles.main} ${fade ? styles.fadeOut : ""}`}>
      <div className={styles.square}>
        <div className={styles.books}>
          <b className={styles.greeting}>현재 공부</b>
          <div className={`${styles.book} ${styles.book1}`} />
          <div className={`${styles.book} ${styles.book2}`} />
          <div className={`${styles.book} ${styles.book3}`} />
          <div className={`${styles.book} ${styles.book4}`} />
          <div className={`${styles.book} ${styles.book5}`} />
        </div>
      </div>
    </div>
  );
}
