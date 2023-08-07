import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./StudentRecordWord.module.css";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";

import { useDispatch, useSelector } from "react-redux";
import { fetchTheme } from "../../store/actions/themeAction";

import { useDebounce } from "../Common/hooks/useDebounce";
import speak from "../../assets/images/speak.png";

export default function StudentTalking() {
  const {
    transcript, // 말이 변환된 글자!!!!!!!
    listening,
    // resetTranscript,
    browserSupportsSpeechRecognition,
  } = useSpeechRecognition();

  const [speechWord, setSpeechWord] = useState("");
  const navigate = useNavigate();
  const debounceTerm = useDebounce(speechWord, 3000); // speechWord가 끝나면 3초 후에 정답 처리를 위해
  // 오답처리나 정답 처리를 바로 하지 않기 위해서

  useEffect(() => {
    const timer = setTimeout(() => {
      SpeechRecognition.startListening({ continuous: true });
      // console.log("마운트 5초뒤 speech 함수가 실행되었습니다.");
    }, 800); // 800ms = 0.8초  노인 반응 속도논문 평균 0.846초이니까 먼저 녹음 시작
    // 5초 동안 녹음 지속

    // 컴포넌트가 언마운트될 때 타이머를 정리합니다.
    return () => clearTimeout(timer);
  }, []); // 빈 의존성 배열로 인해 컴포넌트가 마운트될 때만 effect가 실행됩니다.

  useEffect(() => {
    setSpeechWord(transcript);
  }, [transcript]); // transcript가 변경되면 speechWord가 state 변경시킨다.

  const removeSpaces = (str) => str.replace(/\s/g, ""); // 공백 제거 함수
  const normalizedDebounceTerm = removeSpaces(debounceTerm);



  return (
    <div className={styles.main}>
      <div className={styles.square}>
        <div className={styles.theme}>    
          <div className={styles.text}>
          </div>
          <div className={styles.microphone}>
            <p className={styles.volume}>{listening ? "🔊" : "🔇"}</p>
            <p>{transcript}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
