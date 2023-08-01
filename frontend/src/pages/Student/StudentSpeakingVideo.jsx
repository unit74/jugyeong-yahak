import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./StudentSpeakingVideo.module.css";

// 예시영상 페이지
export default function StudentSpeakingVideo() {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate("/review-word");
    }, 10000); // 10초

    // 언마운트 됐을시 타이머 클리어
    return () => {
      clearTimeout(timer);
    };
  }, [navigate]);

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
