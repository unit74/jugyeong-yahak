import React, { useState } from "react";
import styles from "./TeacherMain.module.css";
import TeacherHeader from "./TeacherHeader";

import { useNavigate } from "react-router-dom";

const TeacherMain = () => {
  const navigate = useNavigate();
  // const [userName, setUserName] = useState(""); // userName state 추가

  const userInfo = JSON.parse(localStorage.getItem("userInfo"));

  const handleClick_1 = () => {
    navigate("/teacher-class");
  };

  const handleClick_2 = () => {
    navigate("/teacher-studentinfo");
  };

  const handleClick_3 = () => {
    navigate("/teacher-studentprogress");
  };

  return (
    <div className={styles.main}>
      <TeacherHeader />
      <div className={styles.bannerContainer}>
        <img
          className={styles.bannerImage}
          alt=""
          src="../../rectangle-4220@2x.png"
        />
        <section className={styles.welcome}>
          <b>👋🏻 {userInfo.name} 님, 안녕하세요!</b>
          <span style={{ display: "block", textAlign: "center" }}>
            주경야학과 함께라면, 언제 어디서든 야학 봉사가 가능합니다!
          </span>
        </section>
      </div>
      <section className={styles.question}>
        <p>
          어떤 <span className={styles.emphasis}>업무</span>를 도와드릴까요?
        </p>
      </section>

      {/* 네모 박스 시작 */}
      <section className={styles.options}>
        <article className={styles.option} onClick={handleClick_1}>
          <div className={styles.optionImage}></div>
          <div className={styles.optionText}>
            <p>실시간 수업</p>
            <p>시작하기</p>
          </div>
          <img
            className={`${styles.optionIcon} ${styles.enlargedIcon}`}
            alt=""
            src="/twemojiwomanteacher.svg"
          />
        </article>

        <article className={styles.option} onClick={handleClick_2}>
          <div className={styles.optionImage}></div>
          <div className={styles.optionText}>
            <p>학생 정보</p>
            <p>확인하기</p>
          </div>
          <img className={styles.optionIcon} alt="" src="/group-2175.svg" />
        </article>

        <article className={styles.option} onClick={handleClick_3}>
          <div className={styles.optionImage}></div>
          <div className={styles.optionText}>
            <p>학생 진도율</p>
            <p>확인하기</p>
          </div>
          <img className={styles.optionIcon} alt="" src="/group-2176.svg" />
        </article>
      </section>
    </div>
  );
};

export default TeacherMain;
