import React, { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./StudentSpeakingVideo.module.css";
import useTimeoutCallback from "../Common/hooks/useTimeoutCallback";

// 예시영상 페이지
export default function StudentSpeakingVideo() {
  const navigateToRecordDictation = useCallback((navigate) => {
    navigate("/situation");
  }, []);

  useTimeoutCallback(navigateToRecordDictation, 10000); // 10초

  return (
    <div className={styles.main}>
      <div className={styles.square}>
        <div className={styles.theme}>
          {/*  */}

          <p>예시 영상 </p>
          <p>영상 끝나는 시간에 맞춰 setTimeout 설정 시간 변경해야함 </p>
        </div>
      </div>
    </div>
  );
}
