import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import styles from "./GoodFeedback.module.css";
import bad from "../../assets/images/bad_feedback.png";

//단어읽기 문제 표시 페이지
export default function StudentReviewWord() {
  const location = useLocation();
  const course = location.state.course;
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      // 다시 도전 없애기
      if (course === "reading") {
        //   navigate('/review-word');
        // } else if (course === 'writing') {
        navigate("/dictation-question");
      }
    }, 5000); // 10초

    // 언마운트 될 시 타이머 클리어
    return () => {
      clearTimeout(timer);
    };
  }, [course, navigate]);

  return (
    <div className={styles.main}>
      <div className={styles.square}>
        <div className={styles.theme}>
          {" "}
          <div className={styles.feedback}>
            <img src={bad} alt="bad_img" />
            <b className={styles.b}>아쉬워요.</b>
          </div>
        </div>
      </div>
    </div>
  );
}
