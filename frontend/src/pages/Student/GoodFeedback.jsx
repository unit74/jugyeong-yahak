import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import styles from "./GoodFeedback.module.css";
import good from "../../assets/images/good_feedback.png";
import confetti from "canvas-confetti";

//단어읽기 문제 표시 페이지
export default function GoodFeedback() {
  const location = useLocation();
  const course = location.state.course;
  const navigate = useNavigate();
  
  useEffect(() => {
    const timer = setTimeout(() => {
      if (course === 'reading') {
        navigate('/dictation-main');
      } else if (course === 'writing') {
        navigate('/diary');
      } else if (course === 'diary') {
        navigate('/student-done');
      } 
    }, 10000); // 10초

    // 언마운트 될 시 타이머 클리어
    return () => {
      clearTimeout(timer);
    };
  }, [course, navigate]);

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
