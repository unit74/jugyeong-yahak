import React, { useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./StudentDictationMain.module.css";
import useTimeoutCallback from "../Common/hooks/useTimeoutCallback";
import TTSsentence from "../Common/TTSsentence";

// 받아쓰기 안내 -> 공책이 있는지 물어보기
export default function StudentDictationMain() {
  const navigate = useNavigate();

  // 7일에 한번씩만 보여줘
  const timeNow = new Date();
  const lastVisitedString = localStorage.getItem("lastVisitedSpeakingVideo");
  const lastVisited = lastVisitedString
    ? new Date(lastVisitedString)
    : new Date(0);

  // 이동할 다음 페이지 결정
  const moveToNextPage = () => {
    const daysPassed = (timeNow - lastVisited) / (1000 * 60 * 60 * 24); // 초를 일 단위로 변환

    // 일주일이 지났는지 확인해서 경로 반환
    if (daysPassed >= 7) {
      localStorage.setItem("lastVisitedSpeakingVideo", timeNow.toISOString());
      return "/dictation-video";
    } else {
      return "/dictation-question";
    }
  };

  const navigateToNextPage = useCallback(() => {
    // 페이지 이동
    navigate(moveToNextPage());
  }, [navigate]);

  useTimeoutCallback(navigateToNextPage, 10000); // 10초

  return (
    <div className={styles.main}>
      <div className={styles.square}>
        <div className={styles.theme}>
          {/*  */}
          <h1>받아쓰기 안내 메인페이지</h1>
        </div>
      </div>
    </div>
  );
}
