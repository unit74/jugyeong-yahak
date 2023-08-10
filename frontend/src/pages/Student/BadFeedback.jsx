import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import styles from "./BadFeedback.module.css";
import bad from "../../assets/images/bad_feedback.png";
import TTSsentence from "../Common/TTSsentence";

export default function BadFeedback() {
  const location = useLocation();
  const course = location.state.course;
  const navigate = useNavigate();

  const [msg, setMsg] = useState(null);

  const ttsMaker = async (msg, timer) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        setMsg(msg);
        resolve();
      }, timer);
    });
  };

  const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  useEffect(() => {
    async function makeRequest() {
      await delay(1000);

      let text = "";

      if (course !== "reading") {
        text = "다시 도전!! 한번 더 써 볼까요?";
        ttsMaker(text, 0);
        await delay(text.length * 300);
        navigate("/dictation-answer");
      } else {
        text = "아쉬워요! 더 열심히 공부해보아요.";
        ttsMaker(text, 0);
        await delay(text.length * 300);
        navigate("/dictation-question");
      }
    }

    makeRequest();

    // if (course !== "reading") {
    //   ttsMaker("다시 도전!! 한번 더 써 볼까요?", 0);
    // }

    // const timer = setTimeout(() => {
    //   // 다시 도전 없애기
    //   if (course === "reading") {
    //     //   navigate('/review-word');
    //     // } else if (course === 'writing') {
    //     navigate("/dictation-question");
    //   } else {
    //     setTimeout(() => {
    //       navigate("/dictation-answer");
    //     }, 1000);
    //   }
    // }, 5000); // 10초

    // // 언마운트 될 시 타이머 클리어
    // return () => {
    //   clearTimeout(timer);
    // };
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
          {msg && (
            // <TTS message={`${userInfo.name}님, 안녕하세요! 지금은 혼자 학습 시간입니다.`} />
            <TTSsentence message={msg} />
          )}
          {/* <TTS message={"다시 도전!! 한번 더 읽어 볼까요?"} /> */}
        </div>
      </div>
    </div>
  );
}
