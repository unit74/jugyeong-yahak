import React, { useCallback, useState } from "react";
import styles from "./StudentMain.module.css";
import { useLocation, useNavigate } from "react-router-dom";
import useTimeoutCallback from "../Common/hooks/useTimeoutCallback";

export default function StudentMain() {
  const navigate = useNavigate();
  const [fade, setFade] = useState(false);

  const navigateToRecordDictation = useCallback(() => {
    setFade(true);
    setTimeout(() => {
      navigate("/");
    }, 1000); // fadeout 후 이동
  }, [navigate]);

  useTimeoutCallback(navigateToRecordDictation, 15000); // 10초

  return (
    <div className={`${styles.main} ${fade ? styles.fadeOut : ""}`}>
      <div className={styles.square}>
        <div className={styles.greeting}>
          <b className={styles.b}>오늘 공부 끝</b>
        </div>
      </div>
    </div>
  );
}
