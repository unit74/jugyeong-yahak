import React, { useCallback, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./StudentDiaryMain.module.css";
import useTimeoutCallback from "../Common/hooks/useTimeoutCallback";
import TTSsentence from "../Common/TTSsentence";
import listenImg from "../../assets/images/listening.png";
import speakImg from "../../assets/images/speaking.png";
import resultImg from "../../assets/images/result_writing.png";

// 받아쓰기 안내 -> 공책이 있는지 물어보기
export default function StudentDiaryMain() {
  const navigate = useNavigate();

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
      let text = "함께 대화하며 일기를 써봐요!";
      ttsMaker(text, 0);
      await delay(text.length * 300);

      // 이름 -> 나중에 성별로 바꾸기
      let listenText = `질문을 듣고, ${
        userInfo === undefined ? "" : userInfo.name
      }님의 이야기를 들려주세요!`;
      ttsMaker(listenText, 0);
      await delay(listenText.length * 300);

      let resultText = "대화를 모두 마치면, 일기가 완성돼요!";
      ttsMaker(resultText, 0);
      await delay(resultText.length * 300);

      navigate("/student-talking");
    }

    makeRequest();
  }, []);

  return (
    <div className={`${styles.main}`}>
      <div className={styles.square}>
        <div className={styles.theme}>
          <b className={styles.b}>일기쓰기</b>
          {msg && <TTSsentence message={msg} />}
          <div className={styles.imageSituationContainer}>
            <div>
              <img src={listenImg} alt="listenImg" />
              <p>질문듣기</p>
            </div>
            <div>
              <img src={speakImg} alt="speakImg" />
              <p>답하기</p>
            </div>
            <div>
              <img src={resultImg} alt="resultImg" />
              <p>완성된 일기 읽기</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
