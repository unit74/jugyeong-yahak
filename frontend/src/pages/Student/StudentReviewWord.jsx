import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./StudentReviewWord.module.css";

import { useDispatch, useSelector } from "react-redux";
import { fetchTheme } from "../../store/actions/themeAction";


export default function StudentReviewWord() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const wordsList = useSelector((state) => state.themeState.wordsList) || [];
  const wordIndex = useSelector((state) => state.wordIndexState.wordIndex);

  useEffect(() => {
    dispatch(fetchTheme());
    const timer = setTimeout(() => {
      SpeechRecognition.startListening();
      // console.log("마운트 5초뒤 speech 함수가 실행되었습니다.");
    }, 800); // 800ms = 0.8초  노인 반응 속도논문 평균 0.846초이니까 먼저 녹음 시작
    // 5초 동안 녹음 지속

    // 컴포넌트가 언마운트될 때 타이머를 정리합니다.
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    setSpeechWord(transcript);
  }, [transcript]); // transcript가 변경되면 speechWord가 state 변경시킨다.

  useEffect(() => {
    dispatch(fetchTheme());
    const timer = setTimeout(() => {
      navigate("/record-word");
    }, 10000); // 10초 후 전환

    // 언마운트 됐을시 타이머 클리어
    return () => {
      clearTimeout(timer);
    };
  }, [navigate]);

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
