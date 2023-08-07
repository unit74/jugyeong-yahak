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

export default function StudentRecordWord() {
  // DB에 저장된 단어 가져오기
  const dispatch = useDispatch();
  const wordsList = useSelector((state) => state.themeState.wordsList) || [];
  const wordIndex = useSelector((state) => state.wordIndexState.wordIndex);

  // 음성인식 관련
  const {
    transcript,
    listening,
    browserSupportsSpeechRecognition,
  } = useSpeechRecognition();


    useEffect(() => {
      dispatch(fetchTheme());
      
      const startListeningWithDelay = (delay) => {
        return setTimeout(() => {
          SpeechRecognition.startListening();
        }, delay);
      };
      
      // 첫번째 음성인식 시작
      const timer1 = startListeningWithDelay(800); 
      
      // 5초 후 두번째 음성인식 시작
      const timer2 = startListeningWithDelay(5800); 
      
      // 10초 후 세번째 음성인식 시작
      const timer3 = startListeningWithDelay(10800); 
      
      return () => {
        // 워드 리스트 빈배열로 바꿔줭
        clearTimeout(timer1);
        clearTimeout(timer2);
        clearTimeout(timer3);
      };
    }, []);
    
    // 녹음된 답변들을 저장할 배열
    const [recordedTranscripts, setRecordedTranscripts] = useState([]);
    const debounceTerm = useDebounce(transcript, 3000);

    // 들은 정답의 공백을 없앰
    const removeSpaces = (str) => str.replace(/\s/g, "");
    const normalizedDebounceTerm = removeSpaces(debounceTerm);

    useEffect(() => {
      if (debounceTerm) { 
          setRecordedTranscripts(prev => [...prev, normalizedDebounceTerm]);
          console.log("녹음됨!")
      } else {
          // 아무것도 녹음되지 않았을 때 공백을 배열에 추가
          setRecordedTranscripts(prev => [...prev, ""]);
          console.log("녹음되지 않음!")
      }
  }, [debounceTerm]);
  
    const navigate = useNavigate();

    useEffect(() => {
        console.log(recordedTranscripts);
        if (recordedTranscripts.length === 5) {
          if (recordedTranscripts.some(transcript => transcript === wordsList[wordIndex]?.word)) {
            navigate("/good-feedback", { state: { course: "reading" } });
          } else {
            navigate("/bad-feedback", { state: { course: "reading" } });
          }
        }
    }, [recordedTranscripts, navigate]);


  return (
    <div className={styles.main}>
      <div className={styles.square}>
        <div className={styles.theme}>
          <img
            className={styles.wordimg}
            src={wordsList.length > 0 && wordsList[wordIndex].wordImageUrl}
            alt=""
          />

          <div className={styles.text}>
            <h1 className={styles.situationText}>
              {wordsList.length > 0 && wordsList[wordIndex].word}
            </h1>
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
