import React from "react";
import styles from "./LiveGood.module.css";
import good from "../../assets/images/good_feedback.png";
import confetti from "canvas-confetti";

//단어읽기 문제 표시 페이지
export default function LiveGood() {
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
