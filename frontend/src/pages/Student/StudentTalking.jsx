import { useNavigate } from "react-router-dom";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useDebounce } from "../Common/hooks/useDebounce";
import styles from "./StudentDiary.module.css";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";
import TTSsentence from "../Common/TTSsentence";

export default function StudentTalking() {
  // 변수
  const [speechWord, setSpeechWord] = useState("");
  const debounceTerm = useDebounce(speechWord, 2000);
  const [themeTitle, setThemeTitle] = useState(null);

  // 음성 인식
  const { transcript, listening } = useSpeechRecognition();

  const [msg, setMsg] = useState(null);

  const ttsMaker = async (msg, timer) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        setMsg(msg);
        resolve();
      }, timer);
    });
  };

  // useEffect
  useEffect(() => {
    // 1. 테마명 받아오기
    axios
      .get("https://i9e206.p.ssafy.io/api/v1/themes/8")
      .then((response) => {
        setThemeTitle(response.data.data.theme);
        ttsMaker(
          `1분 동안 ${response.data.data.theme}에 관한 경험을 이야기 해주세요!! 너무 어렵다면, 어렵다!라고 말씀해주세요!!`,
          0
        );
      })
      .catch((error) => console.error(`Error: ${error}`));

    // 2. 마운트 후 0.8초 뒤 녹음 시작
    const startTimer = setTimeout(() => {
      SpeechRecognition.startListening({ continuous: true });

      // 1분 후 녹음 중지
      const stopTimer = setTimeout(() => {
        SpeechRecognition.stopListening();
        setSpeechWord(transcript);
      }, 20000); // 60,000ms = 1분

      return () => clearTimeout(stopTimer);
    }, 10000);

    return () => {
      clearTimeout(startTimer);
    };
  }, [transcript]);

  // 2. transcript를 speechWord에 저장
  useEffect(() => {
    setSpeechWord(transcript);
  }, [transcript]);

  // 3. 이야기하기 어려워하시면 기존 일기로 연결
  const navigate = useNavigate();

  useEffect(() => {
    if (speechWord.includes("어렵다")) {
      navigate("/diary", { state: { message: "" } });
    }
  }, [speechWord, navigate]);

  useEffect(() => {
    if (debounceTerm) {
      navigate("/diary", { state: { message: debounceTerm } });
    }
  }, [debounceTerm, navigate]);

  return (
    <div className={styles.main}>
      <div className={styles.square}>
        <div className={styles.theme}>
          <div className={styles.text}></div>
          <div className={styles.microphone}>
            <h1>{themeTitle}에 관한 경험을 이야기해보아요!</h1>
            <p className={styles.volume}>{listening ? "🔊" : "🔇"}</p>
            <p>{transcript}</p>
            {msg && <TTSsentence message={msg} />}
            <div></div>
          </div>
        </div>
      </div>
    </div>
  );
}
