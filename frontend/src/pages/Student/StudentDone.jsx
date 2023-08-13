import React, { useCallback, useEffect, useState } from "react";
import styles from "./StudentMain.module.css";
import { useLocation, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import useTimeoutCallback from "../Common/hooks/useTimeoutCallback";
import axios from "axios";

export default function StudentMain() {
  const navigate = useNavigate();
  const [fade, setFade] = useState(false);

  const themeId = useSelector((state) => state.themeState.themeData.id);

  const navigateToRecordDictation = useCallback(() => {
    setFade(true);
    setTimeout(() => {
      navigate("/");
    }, 1000); // fadeout 후 이동
  }, [navigate]);

  useTimeoutCallback(navigateToRecordDictation, 15000); // 10초

  // 복습완료 후 상태 변경해줘야됨
  useEffect(() => {
    axios.post(`https://i9e206.p.ssafy.io/api/v1/themes/review/${themeId}`);
  }, []);

  return (
    <div className={`${styles.main} ${fade ? styles.fadeOut : ""}`}>
      <div className={styles.square}>
        <div className={styles.greeting}>
          <b className={styles.b}>여기는 책장</b>
        </div>
      </div>
    </div>
  );
}
