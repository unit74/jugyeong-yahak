import React, { useCallback, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./StudentReadingMain.module.css";
import useTimeoutCallback from "../Common/hooks/useTimeoutCallback";
import TTSsentence from "../Common/TTSsentence";
import listenImg from "../../assets/images/listening.png";
import writeImg from "../../assets/images/writing.png";
import readImg from "../../assets/images/reading.png";

// 받아쓰기 안내 -> 공책이 있는지 물어보기
export default function StudentReadingMain() {
  const navigate = useNavigate();

  // 7일에 한번씩만 보여줘
  const timeNow = new Date();
  const lastVisitedString = localStorage.getItem("lastVisitedSpeakingVideo");
  const lastVisited = lastVisitedString ? new Date(lastVisitedString) : new Date(0);


  const [msg, setMsg] = useState(null);
  const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
  const [userInfo, setUserInfo] = useState(JSON.parse(localStorage.getItem("userInfo")));

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
      let text = "단어를 배워요! 총 5개의 단어를 공부해요.";
      ttsMaker(text, 0);
      await delay(text.length * 300);

      // 이름 -> 나중에 성별로 바꾸기
      let readingText = `먼저, 단어의 올바른 발음을 공부해요`;
      ttsMaker(readingText, 0);
      await delay(readingText.length * 300);

      let writingText = "다음으로 받아쓰기를 해요";
      ttsMaker(writingText, 0);
      await delay(writingText.length * 300);
      
      navigate('/record-word');
    }

    makeRequest();
  }, []);


  // useTimeoutCallback(navigateToNextPage, 10000); // 10초

  return (
    <div className={`${styles.main}`}>
      <div className={styles.square}>
        <div className={styles.theme}>
          <b className={styles.b}>단어공부</b>
          {msg && <TTSsentence message={msg} />}
          <div className={styles.imageSituationContainer}>
            <div>
              <img src={readImg} alt="readImg" />
              <p>단어읽기</p>
            </div>
            <div>
              <img src={writeImg} alt="writeImg" />
              <p>받아쓰기</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
