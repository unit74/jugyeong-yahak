import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./StudentReviewWord.module.css";

import { useDispatch, useSelector } from 'react-redux';
import { fetchTheme } from '../../store/actions/themeAction';


//단어읽기 문제 표시 페이지
export default function StudentReviewWord() {
  const navigate = useNavigate();

  // axios !!!!!!!!!
  // 단어 조회
  const dispatch = useDispatch();
  
  const wordsList = useSelector((state) => state.themeState.wordsList) || []; 
  const wordIndex = useSelector((state) => state.wordIndexState.wordIndex); 

  useEffect(() => {
    dispatch(fetchTheme())
    // const timer = setTimeout(() => {
    //   navigate("/record-word");
    // }, 10000); // 10초

    
    // 언마운트 됐을시 타이머 클리어
    return () => {
      // clearTimeout(timer);
    };
  }, [navigate]);
  
  // 5개 바뀌는 로직 짜야함
  return (
    <div className={styles.main}>
      <div className={styles.square}>
        <div className={styles.theme}>
          <img src={wordsList.length > 0 && wordsList[wordIndex].wordImageUrl} alt="" />
          <h1>{wordsList.length > 0 && wordsList[wordIndex].word}</h1>
        </div>
      </div>
    </div>
  );
}
