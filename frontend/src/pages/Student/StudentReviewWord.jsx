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
