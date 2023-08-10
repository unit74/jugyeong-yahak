import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import styles from "./GoodFeedback.module.css";
import good from "../../assets/images/good_feedback.png";
import confetti from "canvas-confetti";
import TTSsentence from "../Common/TTSsentence";

import { useDispatch, useSelector } from "react-redux";
import { setWordIndex } from "../../store/actions/setWordIndexAction";

//단어읽기 문제 표시 페이지
export default function GoodFeedback() {
  const dispatch = useDispatch();
  const location = useLocation();
  const course = (location.state && location.state.course) || "";
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
    ttsMaker("정말 잘하셨어요!!", 0);

    const timer = setTimeout(() => {
      if (course === "reading") {
        ttsMaker("이제 받아쓰기를 해볼까요?", 0);
        setTimeout(() => {
          navigate("/dictation-question");
        }, 3500);
      } else if (course === "writing" && wordIndex < 5) {
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
      } else if (course === "diary") {
        navigate("/student-done");
      }
    }, 5000); // 10초

    // 언마운트 될 시 타이머 클리어
    return () => {
      clearTimeout(timer);
    };
  }, [course, navigate]);

  // 컨페티효과
  confetti({
    spread: 400,
    particleCount: 400,
    angle: 360,
  });

  return (
    <div className={styles.main}>
      <div className={styles.square}>
        <div className={styles.theme}>
          {" "}
          <div className={styles.feedback}>
            <img src={good} alt="good_img" />
            <b className={styles.b}>잘하셨어요!</b>
          </div>
          {/* {course === "reading" ? (
            <TTS message={"이제 받아쓰기를 해볼까요?"} />
          ) : course === "writing" ? (
            <TTS message={"이제 일기를 써볼까요?"} />
          ) : (
            ""
          )} */}
          {msg && (
            // <TTS message={`${userInfo.name}님, 안녕하세요! 지금은 혼자 학습 시간입니다.`} />
            <TTSsentence message={msg} />
          )}
        </div>
      </div>
    </div>
  );
}
