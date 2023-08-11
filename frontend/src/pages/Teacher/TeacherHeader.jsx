import React, { useState } from "react";
import styles from "./TeacherHeader.module.css";

// 로그인 사용자 이름 저장
const TeacherHeader = () => {
  // const [loggedinUser] = useState("김나연");

  const userInfo = JSON.parse(localStorage.getItem("userInfo"));

  return (
    <header className={styles.header}>
      {/* 로고 자리 */}
      <div className={styles.left}>
        <span>주경야학</span>
      </div>
      <div className={styles.right}>
        <b>{`${userInfo.name} 봉사자님`}</b>
        {/* button에 다시 로그인 하는 url로 연결할 것 */}
        <button className={styles.logout}>Logout</button>
      </div>
    </header>
  );
};

export default TeacherHeader;
