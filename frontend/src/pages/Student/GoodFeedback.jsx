import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import styles from "./GoodFeedback.module.css";
import good from "../../assets/images/good_feedback.png";
import confetti from "canvas-confetti";

import { useDispatch, useSelector } from "react-redux";
import { setWordIndex } from "../../store/actions/setWordIndexAction";

//단어읽기 문제 표시 페이지
export default function GoodFeedback() {
  const dispatch = useDispatch();
  const location = useLocation();
  const course = (location.state && location.state.course) || "";
  const navigate = useNavigate();

  const wordIndex = useSelector((state) => state.wordIndexState.wordIndex);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (course === "reading") {
        navigate("/dictation-question");
      } else if (course === "writing" && wordIndex < 5) {
        dispatch(setWordIndex());
        navigate("/review-word");
      } else if (course === "writing" && wordIndex === 5) {
        navigate("/diary");
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
        </div>
      </div>
    </div>
  );
}
