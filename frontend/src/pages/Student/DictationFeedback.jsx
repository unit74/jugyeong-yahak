import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import styles from "./DictationFeedback.module.css";
import TTSsentence from "../Common/TTSsentence";

import { useDispatch, useSelector } from "react-redux";
import { setWordIndex } from "../../store/actions/setWordIndexAction";

export default function DictaionFeedback() {
  const dispatch = useDispatch();
  const location = useLocation();
  const { course, studentAnswer, correctAnswer } = location.state;
  const navigate = useNavigate();

  const [msg, setMsg] = useState(null);

  const wordIndex = useSelector((state) => state.wordIndexState.wordIndex);

  const ttsMaker = async (msg, timer) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        setMsg(msg);
        resolve();
      }, timer);
    });
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      if (course === "writing" && wordIndex < 5) {
        ttsMaker("다른 단어를 배워볼까요?", 0);
        setTimeout(() => {
          dispatch(setWordIndex());
          navigate("/review-word");
        }, 3500);
      } else if (course === "writing" && wordIndex === 5) {
        ttsMaker("이제 일기를 써볼까요?", 0);
        setTimeout(() => {
          navigate("/diary");
        }, 3500);
      }
    }, 5000); // 5초

    // 언마운트 될 시 타이머 클리어
    return () => {
      clearTimeout(timer);
    };
  }, [course, navigate]);

  return (
    <div className={styles.main}>
      <div className={styles.square}>
        {/* <div className={styles.theme}> */}
        {/* <div className={styles.feedback}> */}
        {course === "writing" && (
          <>
            <p className={styles.correctAnswer}>{correctAnswer}</p>
            <b className={styles.b}>{studentAnswer}</b>
          </>
        )}
        {/* </div> */}
        {msg && <TTSsentence message={msg} />}
        {/* </div> */}
      </div>
    </div>
  );
}
