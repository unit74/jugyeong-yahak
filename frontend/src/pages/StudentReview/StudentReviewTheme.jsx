import React, { useEffect } from "react";
import styles from "./StudentReviewTheme.module.css";
import { useNavigate } from "react-router-dom";

import { useDispatch, useSelector } from 'react-redux';
import { fetchTheme } from '../../store/actions/themeAction';

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

  // 테마 하나 상세 조회
  const dispatch = useDispatch();
  const themeData = useSelector((state) => state.themeState.themeData);
  const wordsList = useSelector((state) => state.themeState.wordsList);

  useEffect(() => {
    if (!themeData || !wordsList) {
      dispatch(fetchTheme());
    }
    // 10초 후 다음 페이지로 이동
    // const timer = setTimeout(() => {
    //   navigate(moveToNextPage());
    // }, 10000); // 10초

    // 컴포넌트가 언마운트될 때 타이머 클리어
    return () => {
      // clearTimeout(timer);
    };
  }, []);

  // themes 상태 사용 예시
  console.log(themeData)
  // const themeName = themeData.theme
  // const themeImg = themeData.themeImageUrl
  // const themeSituation = themeData.situation

  return (
    <div className={styles.main}>
      <div className={styles.square}>
        <div className={styles.theme}>
          <b className={styles.b}>📖 오늘의 주제 📖</b>
            {themeData && wordsList ? (
            <>
              {/* 데이터가 있는 경우 UI 렌더링 */}
              <h1>{themeData.theme}</h1>
              <h3>{themeData.situation}</h3>
              <img src={themeData.themeImageUrl} alt="" />

            </>
          ) : (
            // 데이터가 없는 경우 로딩 표시 등을 렌더링
            <div>Loading...</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StudentReviewTheme;
