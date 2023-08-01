import React from "react";
import styles from "./TeacherTheme.module.css";
import TeacherHeader from "./TeacherHeader";
import ThemeCarousel from "./ThemeCarousel";

const TeacherTheme = () => {
  return (
    <div className={styles.ipadPro1115}>
      <TeacherHeader />
      <main className={styles.main}>
        <div>
          <span>오늘의 </span>
          <span className={styles.topic}>주제</span>
          <span>를 선택해주세요</span>
        </div>
      </main>
      <ThemeCarousel />
    </div>
  );
};

export default TeacherTheme;
