import React, { useCallback, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./StudentReadingMain.module.css";
import useTimeoutCallback from "../Common/hooks/useTimeoutCallback";
import TTSsentence from "../Common/TTSsentence";
import listenImg from "../../assets/images/listening.png";
import writeImg from "../../assets/images/writing.png";
import readImg from "../../assets/images/reading.png";
import CLOVA from "../Common/CLOVA";

// 받아쓰기 안내 -> 공책이 있는지 물어보기
export default function StudentReadingMain() {
  const navigate = useNavigate();
  const [fade, setFade] = useState(false);
  // 7일에 한번씩만 보여줘
  const timeNow = new Date();
  const lastVisitedString = localStorage.getItem("lastVisitedSpeakingVideo");
  const lastVisited = lastVisitedString
    ? new Date(lastVisitedString)
    : new Date(0);

  const [msg, setMsg] = useState(null);
  const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
  const [userInfo, setUserInfo] = useState(
    JSON.parse(localStorage.getItem("userInfo"))
  );
  const [activeEffect, setActiveEffect] = useState(null); // 'reading' or 'writing'

  const ttsMaker = async (msg, timer) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        setMsg(msg);
        resolve();
      }, timer);
    });
  };

  useEffect(() => {
    async function makeRequest() {
      let text = "자, 이제 단어를 배워볼까요? 총 5개의 단어를 공부해요.";
      ttsMaker(text, 0);
      await delay(text.length * 200);

      let readingText = `먼저, 올바른 발음을 공부해요`;
      setActiveEffect("reading");
      ttsMaker(readingText, 0);
      await delay(readingText.length * 200);

      let writingText = "다음으로 받아쓰기를 해요";
      setActiveEffect("writing");
      ttsMaker(writingText, 0);
      await delay(writingText.length * 200);

      let nextText = "자, 첫 번째 단어부터 공부해볼까요?";
      setActiveEffect(null);
      ttsMaker(nextText, 0);
      await delay(nextText.length * 200);

      setFade(true);
      navigate("/word-explain");
    }

    makeRequest();
  }, []);

  return (
    <div className={`${styles.main} ${fade ? styles.fadeOut : ""}`}>
      <div className={styles.square}>
        <div className={styles.greeting}>
          <b className={styles.b}>단어 5개 공부</b>
          {msg && <CLOVA message={msg} />}
        </div>
        <div
          className={`${
            activeEffect === "reading" ? styles.pulsatingDiv : ""
          } ${styles.time}`}
        >
          <img
            className={styles.responsive_image}
            src={readImg}
            alt="readImg"
          />
          <p className={styles.info}>단어읽기</p>
        </div>
        <div
          className={`${
            activeEffect === "writing" ? styles.pulsatingDiv : ""
          } ${styles.time}`}
        >
          <img
            className={styles.responsive_image}
            src={writeImg}
            alt="writeImg"
          />
          <p className={styles.info}>받아쓰기</p>
        </div>
      </div>
    </div>
  );
}
