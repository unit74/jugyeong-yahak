import React from "react";
import styles from "./TeacherTheme.module.css";
import TeacherHeader from "./TeacherHeader";
// import ThemeCarousel from "./ThemeCarousel";

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

        {/* div 시작 */}
        <div className={styles.topicsContainer}>
          <div className={styles.topicBox}>
            <img alt="" src="/image-72@2x.png" />
            <div>학교</div>
          </div>
          <div className={styles.topicBox}>
            <img alt="" src="/image-73@2x.png" />
            <div>시장</div>
          </div>
          <div className={styles.topicBox}>
            <img alt="" src="/image-74@2x.png" />
            <div>주방</div>
          </div>
          <div className={styles.topicBox}>
            <img alt="" src="/image-75@2x.png" />
            <div>병원</div>
          </div>
          <div className={styles.topicBox}>
            <img alt="" src="/image-76@2x.png" />
            <div>약국</div>
          </div>
        </div>

        {/* div 끝 */}
      </main>
    </div>
  );
};

export default TeacherTheme;
