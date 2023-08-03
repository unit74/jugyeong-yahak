import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./StudentReviewWord.module.css";

// 단어 가져온다.
import { useSelector } from 'react-redux';

//단어읽기 문제 표시 페이지
export default function StudentReviewWord() {
  const navigate = useNavigate();

  // axios !!!!!!!!!
  // 단어 리스트 조회
  const wordsList = useSelector((state) => state.themeState.wordsList);

  useEffect(() => {
   
    // const timer = setTimeout(() => {
    //   navigate("/record-word");
    // }, 10000); // 10초

    
    // 언마운트 됐을시 타이머 클리어
    return () => {
      // clearTimeout(timer);
    };
  }, [navigate]);

  console.log(wordsList)
  return (
    <div className={styles.main}>
      <div className={styles.square}>
        <div className={styles.theme}>
          {/* <WordImgComponent wordImg={thisWord.wordImageUrl}/> */}
          {/* <WordNameComponent wordName={thisWord.word}/> */}
          <p>TTS해야함</p>
        </div>
      </div>
    </div>
  );
}
