import React, { useEffect } from "react";
import styles from "./StudentReviewTheme.module.css";
import { useNavigate } from "react-router-dom";

const StudentReviewTheme = () => {
  const navigate = useNavigate();
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
      return "/speaking-video";
    } else {
      return "/review-word";
    }
  };

  useEffect(() => {
    // 10초 후 다음 페이지로 이동
    const timer = setTimeout(() => {
      navigate(moveToNextPage());
    }, 10000); // 10초

    // 컴포넌트가 언마운트될 때 타이머 클리어
    return () => {
      clearTimeout(timer);
    };
  }, [navigate, lastVisited]);

  return (
    <div className={styles.main}>
      <div className={styles.square}>
        <div className={styles.theme}>
          <b className={styles.b}>📖 오늘의 주제 📖</b>
          {/*  */}
        </div>
      </div>
    </div>
  );
};

export default StudentReviewTheme;
