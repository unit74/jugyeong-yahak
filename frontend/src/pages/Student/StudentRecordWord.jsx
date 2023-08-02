import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./StudentRecordWord.module.css";
import SpeechRecognition, { useSpeechRecognition } from "react-speech-recognition";
import { useState } from "react";
import { useDebounce } from "../Common/hooks/useDebounce";

//단어읽기 문제 표시 페이지
//   const navigate = useNavigate();

//   useEffect(() => {
//     const timer = setTimeout(() => {
//       navigate("/record-word");
//     }, 10000); // 10초

//     // 언마운트 됐을시 타이머 클리어
//     return () => {
//       clearTimeout(timer);
//     };
//   }, [navigate]);
export default function StudentReviewWord() {

  
  const {
    transcript, // 말이 변환된 글자!!!!!!!
    listening,
    // resetTranscript,
    browserSupportsSpeechRecognition
  } = useSpeechRecognition();
  
  const [speechWord, setSpeechWord] = useState("")
  const navigate = useNavigate()
  const debounceTerm = useDebounce(speechWord, 3000) // speechWord가 끝나면 3초 후에 정답 처리를 위해
  // 오답처리나 정답 처리를 바로 하지 않기 위해서


  useEffect(() => {
    const timer = setTimeout(() => {
      SpeechRecognition.startListening(); 
      // console.log("마운트 5초뒤 speech 함수가 실행되었습니다.");
    }, 800); // 800ms = 0.8초  노인 반응 속도논문 평균 0.846초이니까 먼저 녹음 시작
    // 5초 동안 녹음 지속

    // 컴포넌트가 언마운트될 때 타이머를 정리합니다.
    return () => clearTimeout(timer);
  }, []);  // 빈 의존성 배열로 인해 컴포넌트가 마운트될 때만 effect가 실행됩니다.

  useEffect(() => {
    setSpeechWord(transcript);
  }, [transcript]); // transcript가 변경되면 speechWord가 state 변경시킨다.


  useEffect(() => { // debounceterm이 바뀌면 이거 실행할거야
    if (debounceTerm) {
      if (debounceTerm === '가시') { // '가시' 여기다가 문제
        navigate("/good-feedback");  // navigate로 이동 정답 페이지 이동
      } else {
        navigate("/bad-feedback");  // navigate로 이동 오답 페이지 이동   오답 페이지에서 다시 문제 읽기로 넘어가야함
      }
    }
  }, [debounceTerm, navigate]); 
  

  
  if (!browserSupportsSpeechRecognition) {
    return <span>Browser doesn't support speech recognition.</span>;
  }

  return (
    <div className={styles.main}>
      <div className={styles.square}>
        <div className={styles.theme}>
          {/*  */}
          <p>Microphone: {listening ? '녹음중' : '마이크 꺼짐'}</p>
          <p>{transcript}</p>
        </div>
      </div>
    </div>
  );
}
