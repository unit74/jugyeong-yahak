import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./StudentReviewWord.module.css";
// import axios from "axios";

//단어읽기 문제 표시 페이지
export default function StudentReviewWord() {
  const navigate = useNavigate();
  // const [word, setWord] = useState("");

  useEffect(() => {
    // 단어 불러오는 함수 넣기
    // 단어 불러오는 함수 넣기
    // 단어 불러오는 함수 넣기

    const timer = setTimeout(() => {
      navigate("/record-word");
    }, 10000); // 10초

    // 언마운트 됐을시 타이머 클리어
    return () => {
      clearTimeout(timer);
    };
  }, [navigate]);

  return (
    <div className={styles.main}>
      <div className={styles.square}>
        <div className={styles.theme}>
          {/*  */}
          <p>word 나중에 중괄호로 바꿔</p>
          <p>TTS해야함</p>
        </div>
      </div>
    </div>
  );
}
