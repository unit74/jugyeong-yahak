import React, { useEffect, useState } from "react";
import styles from "./TeacherCurriculum.module.css";
import TeacherHeader from "./TeacherHeader";
import axios from "../Common/api/authAxios";

const BASE_URL = "https://i9e206.p.ssafy.io";

const TeacherLiveWord = (props) => {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    return () => {};
  }, []);

  return (
    <div className={styles.ipadPro1115}>
      <TeacherHeader />
      <main className={styles.main}>
        <div>
          <span className={styles.topic}>{props.$.state.curriculum.situation}</span>
        </div>
      </main>
    </div>
  );
};

export default TeacherLiveWord;
