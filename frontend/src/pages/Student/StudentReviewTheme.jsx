import React, { useCallback, useState, useEffect } from "react";
import styles from "./StudentReviewTheme.module.css";
import { useNavigate } from "react-router-dom";
import useTimeoutCallback from "../Common/hooks/useTimeoutCallback";
import axios from "axios";
import TTSsentence from "../Common/TTSsentence";

const StudentReviewTheme = () => {
  const navigate = useNavigate();
  const timeNow = new Date();
  const lastVisitedString = localStorage.getItem("lastVisitedSpeakingVideo");
  const lastVisited = lastVisitedString
    ? new Date(lastVisitedString)
    : new Date(0);
  const [msg, setMsg] = useState(null);

  // fade 효과
  const [fade, setFade] = useState(false);

  // useEffect(() => {
  //   setFade(true);
  // }, []);

  const navigateToRecordDictation = useCallback(() => {
    setFade(true);
    setTimeout(() => {
      navigate(moveToNextPage());
    }, 1000); // fadeout 후 이동
  }, [navigate]);

  // useEffect(() => {
  //   if (fade) {
  //     // 페이지 이동 후 1초 뒤에 fade out
  //     const fadeOutTimer = setTimeout(() => {
  //       setFade(false);
  //     }, 1000);

  //     // 언마운트 될 때 타이머 초기화
  //     return () => clearTimeout(fadeOutTimer);
  //   }
  // }, [fade]);

  // 이동할 다음 페이지 결정
  const moveToNextPage = () => {
    const daysPassed = (timeNow - lastVisited) / (1000 * 60 * 60 * 24); // 초를 일 단위로 변환
    if (daysPassed >= 7) {
      localStorage.setItem("lastVisitedSpeakingVideo", timeNow.toISOString());
      return "/speaking-video";
    } else {
      return "/situation";
    }
  };

  // useEffect(() => {
  //   // 10초 후 다음 페이지로 이동
  //   const timer = setTimeout(() => {
  //     navigate(moveToNextPage());
  //   }, 10000); // 10초

  //   // 컴포넌트가 언마운트될 때 타이머 클리어
  //   return () => {
  //     clearTimeout(timer);
  //   };
  // }, [navigate, lastVisited]);

  // API요청 결과를 담을 변수
  const [themeTitle, setThemeTitle] = useState(null);
  const [themeImg, setThemeImg] = useState(null);
  const [themeSituation, setThemeSituation] = useState(null);

  const ttsMaker = async (msg, timer) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        setMsg(msg);
        resolve();
      }, timer);
    });
  };

  const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  useEffect(() => {
    // setFade(true);

    axios
      .get("https://i9e206.p.ssafy.io/api/v1/themes/30")
      .then((response) => {
        setThemeTitle(response.data.data.theme);
        setThemeImg(response.data.data.themeImageUrl);
        setThemeSituation(response.data.data.situation);
      })
      .catch((error) => console.error(`Error: ${error}`));
    // 10초 후 다음 페이지로 이동
    // const timer = setTimeout(() => {
    //   navigate(moveToNextPage());
    // }, 10000); // 10초
    // return () => {
    //   // clearTimeout(timer);
    // };
  }, []);

  useEffect(() => {
    async function makeRequest() {
      await delay(1000);

      let text = "";

      text = `이번 시간은 ${themeTitle}에 대해 공부해요!`;
      ttsMaker(text, 0);
      await delay(text.length * 300);

      text = `${themeSituation}`;

      ttsMaker(text, 0);
      await delay(text.length * 300);

      navigateToRecordDictation();
    }

    if (themeSituation !== null) {
      makeRequest();
    }
  }, [themeSituation]);

  return (
    <div className={`${styles.main} ${fade ? styles.fadeIn : ""}`}>
      {/* {themeSituation && <TTS message={themeSituation} />} */}
      <div className={styles.square}>
        <div className={styles.theme}>
          <b className={styles.b}>📖 오늘의 주제 : {themeTitle} 📖</b>
          {themeTitle && themeSituation && msg && <TTSsentence message={msg} />}
          <div className={styles.imageSituationContainer}>
            <div className={styles.imageContainer}>
              <img src={themeImg} alt="" />
            </div>
            <h2 className={styles.situationText}>{themeSituation}</h2>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentReviewTheme;
