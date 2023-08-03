import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./StudentReviewWord.module.css";

import { useDispatch, useSelector } from "react-redux";
import { fetchTheme } from "../../store/actions/themeAction";

//단어읽기 문제 표시 페이지
export default function StudentReviewWord() {
  const navigate = useNavigate();

  // axios !!!!!!!!!
  // 단어 조회
  const dispatch = useDispatch();

  const wordsList = useSelector((state) => state.themeState.wordsList) || [];
  const wordIndex = useSelector((state) => state.wordIndexState.wordIndex);

  // fade 효과
  const [fade, setFade] = useState(false);

  useEffect(() => {
    setFade(true);
  }, []);

  useEffect(() => {
    if (fade) {
      // 페이지 이동 후 1초 뒤에 fade out
      const fadeOutTimer = setTimeout(() => {
        setFade(false);
      }, 1000);

      // 언마운트 될 때 타이머 초기화
      return () => clearTimeout(fadeOutTimer);
    }
  }, [fade]);

  //

  useEffect(() => {
    dispatch(fetchTheme());
    // const timer = setTimeout(() => {
    //   navigate("/record-word");
    // }, 10000); // 10초

    // 언마운트 됐을시 타이머 클리어
    return () => {
      clearTimeout(timer);
    };
  }, [navigate]);

  // 5개 바뀌는 로직 짜야함
  return (
    <div className={`${styles.main} ${fade ? styles.fadeIn : ""}`}>
      <div className={styles.square}>
        <div className={styles.theme}>
          <div className={styles.imageSituationContainer}>
            <div className={styles.imageContainer}>
              <img
                src={wordsList.length > 0 && wordsList[wordIndex].wordImageUrl}
                alt=""
              />
            </div>
            <h1 className={styles.situationText}>
              {wordsList.length > 0 && wordsList[wordIndex].word}
            </h1>
          </div>
        </div>
      </div>
    </div>
  );
}
