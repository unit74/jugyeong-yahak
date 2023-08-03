import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./StudentReviewWord.module.css";
import WordImgComponent from '../Common/WordImgComponent'; 
import WordNameComponent from '../Common/WordNameComponent'; 

// axios !!!!!!!!!
import { useDispatch, useSelector } from 'react-redux';
import { fetchWordsList } from '../../store/actions/wordsListAction';
//단어읽기 문제 표시 페이지
export default function StudentReviewWord() {
  const navigate = useNavigate();

  // axios !!!!!!!!!
  // 단어 리스트 조회
  const dispatch = useDispatch();
  const wordsList = useSelector((state) => state.wordsListState.wordsList);
  const wordIndex = useSelector((state) => state.wordIndexState.wordIndex);


  useEffect(() => {
    // axios !!!!!!!!!
    if (wordsList.length === 0) {
      dispatch(fetchWordsList());
      // words가 비어있을 때만 API 요청을 보냅니다.
    }
   
    // const timer = setTimeout(() => {
    //   navigate("/record-word");
    // }, 10000); // 10초

    
    // 언마운트 됐을시 타이머 클리어
    return () => {
      // clearTimeout(timer);
    };
  }, [navigate]);
  
  // axios !!!!!!!!!
  // 5개 바뀌는 로직 짜야함
  // const thisWord = wordsList[wordIndex]
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
