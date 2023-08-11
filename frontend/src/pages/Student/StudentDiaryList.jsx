import React, { useCallback, useState, useEffect } from "react";
import styles from "./StudentMain.module.css";
import { useNavigate } from "react-router-dom";
import useTimeoutCallback from "../Common/hooks/useTimeoutCallback";
import TTSsentence from "../Common/TTSsentence";

export default function StudentDiaryList() {
  const navigate = useNavigate();
  const [fade, setFade] = useState(false);


  return (
    <div className={`${styles.main} ${fade ? styles.fadeOut : ""}`}>
      <div className={styles.square}>
        <div className={styles.greeting}>
          <b className={styles.b}>
            일기장 모아보기
          </b>
          {<TTSsentence message='반갑' />}
        </div>
        {/*  */}
        <div className={styles.time}>
        </div>
      </div>
    </div>
  );
}
