import React, { useEffect } from "react";
import styles from "./StudentMain.module.css";
import { useNavigate } from "react-router-dom";

const StudentMain = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate("/review-theme");
    }, 10000); // 10초

    // 언마운트 됐을시 타이머 클리어
    return () => {
      clearTimeout(timer);
    };
  }, [navigate]);

  return (
    <div className={styles.main}>
      <div className={styles.square}>
        <div className={styles.greeting}>
          <b className={styles.b}>👋🏻 김나연 님, 안녕하세요!</b>
        </div>
        {/*  */}
        <div className={styles.time}>
          <b className={styles.b2}>지금은</b>
          <b className={styles.b3}>혼자 학습</b>
          <b className={styles.b4}>시간</b>
        </div>
      </div>
    </div>
  );
};

export default StudentMain;
