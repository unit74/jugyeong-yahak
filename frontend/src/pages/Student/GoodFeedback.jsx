import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./GoodFeedback.module.css";
import good from "../../assets/images/good_feedback.png";
import confetti from "canvas-confetti";

//단어읽기 문제 표시 페이지
export default function StudentReviewWord() {
  //   const navigate = useNavigate();

  //   useEffect(() => {
  //     const timer = setTimeout(() => {
  //       navigate("/record-word");
  //     }, 10000); // 10초

  //     // 언마운트 됐을시 타이머 클리어
  //     return () => {
  //       clearTimeout(timer);
  //     };
  //   }, [navigate]);

  // 컨페티효과
  confetti({
    spread: 360,
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
