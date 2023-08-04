import React, { useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./StudentDictationQuestion.module.css";
import useTimeoutCallback from "../Common/hooks/useTimeoutCallback";

import { useDispatch, useSelector } from "react-redux";
import { fetchTheme } from "../../store/actions/themeAction";

// 예시영상 페이지
export default function StudentDictationQuestion() {
  const dispatch = useDispatch();

  const wordsList = useSelector((state) => state.themeState.wordsList) || [];
  const wordIndex = useSelector((state) => state.wordIndexState.wordIndex);

  const navigate = useNavigate();

  const navigateToRecordDictation = useCallback((navigate) => {
    navigate("/dictation-answer");
  }, []);

  useTimeoutCallback(navigateToRecordDictation, 10000); // 10초

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
      </div>
    </div>
  );
}
