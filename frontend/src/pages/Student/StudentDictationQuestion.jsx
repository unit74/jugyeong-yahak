import React, { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./StudentDictationQuestion.module.css";
import useTimeoutCallback from "../Common/hooks/useTimeoutCallback";

import { useDispatch, useSelector } from "react-redux";
import { fetchTheme } from "../../store/actions/themeAction";
import TTS from "../Common/TTS";

// 예시영상 페이지
export default function StudentDictationQuestion() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const wordsList = useSelector((state) => state.themeState.wordsList) || [];
  // const wordIndex = useSelector((state) => state.wordIndexState.wordIndex);
  const wordIndex = 4;

  const [repeatValue, setRepeatValue] = useState(0);

  useEffect(() => {
    // 3초 후에 첫 번째 리렌더링
    const timer1 = setTimeout(() => {
      setRepeatValue((prev) => prev + 1);
    }, 3000);

    // 추가 3초 후에 두 번째 리렌더링
    const timer2 = setTimeout(() => {
      setRepeatValue((prev) => prev + 1);
    }, 6000);

    // 추가 3초 후에 세 번째 리렌더링
    const timer3 = setTimeout(() => {
      setRepeatValue((prev) => prev + 1);
    }, 9000);

    // 언마운트될 때, 타이머 클리어
    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  }, []);

  const navigateToRecordDictation = useCallback((navigate) => {
    navigate("/dictation-answer");
  }, []);

  useTimeoutCallback(navigateToRecordDictation, 17000); // 10초

  useEffect(() => {
    dispatch(fetchTheme());
    // const timer = setTimeout(() => {
    //   navigate("/record-word");
    // }, 10000); // 10초

    // 언마운트 됐을시 타이머 클리어
    return () => {
      // clearTimeout(timer);
    };
  }, [navigate]);

  return (
    <div className={styles.main}>
      <div className={styles.square}>
        <img
          className={styles.image}
          src={wordsList.length > 0 && wordsList[wordIndex].wordImageUrl}
          alt=""
        />
        <h1 className={styles.situationText}>
          {wordsList.length > 0 && wordsList[wordIndex].word}
        </h1>
        <div>
          {wordsList[wordIndex].word && (
            <TTS repeat={repeatValue} message={wordsList[wordIndex].word} />
          )}
        </div>
      </div>
    </div>
  );
}
