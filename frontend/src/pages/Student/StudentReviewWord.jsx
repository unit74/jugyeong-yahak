import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./StudentReviewWord.module.css";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";

import { useDispatch, useSelector } from "react-redux";
import { fetchTheme } from "../../store/actions/themeAction";

import { useDebounce } from "../Common/hooks/useDebounce";

export default function StudentReviewWord() {
  // axios !!!!!!!!!
  // 단어 조회
  const dispatch = useDispatch();

  const wordsList = useSelector((state) => state.themeState.wordsList) || [];
  const wordIndex = useSelector((state) => state.wordIndexState.wordIndex);

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
    dispatch(fetchTheme());
    const timer = setTimeout(() => {
      SpeechRecognition.startListening();
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

  useEffect(() => {
    // debounceterm이 바뀌면 이거 실행할거야
    if (debounceTerm) {
      if (normalizedDebounceTerm === wordsList[wordIndex]?.word) {
        // '가시' 여기다가 문제
        navigate("/bad-feedback", { state: { course: "reading" } }); // navigate로 이동 정답 페이지 이동
      } else {
        navigate("/bad-feedback", { state: { course: "reading" } }); // navigate로 이동 오답 페이지 이동   오답 페이지에서 다시 문제 읽기로 넘어가야함
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
          <img
            className={styles.wordimg}
            src={wordsList.length > 0 && wordsList[wordIndex].wordImageUrl}
            alt=""
          />

          <h1 className={styles.situationText}>
            {wordsList.length > 0 && wordsList[wordIndex].word}
          </h1>
        </div>
      </div>
    </div>
  );
}
