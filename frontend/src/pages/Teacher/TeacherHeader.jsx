import React, { useState } from "react";
import styles from "./TeacherHeader.module.css";

const TeacherHeader = () => {
  const [loggedinUser, setLoggedinUser] = useState("김나연");

  return (
    <header className={styles.header}>
      <div className={styles.left}>
        <span>주경야학</span>
      </div>
      <div className={styles.right}>
        <b>{`${loggedinUser} 봉사자님`}</b>
        <button className={styles.logout}>Logout</button>
      </div>
    </header>
  );
};

export default TeacherHeader;
