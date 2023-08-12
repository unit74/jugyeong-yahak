import React, { useEffect, useState } from "react";
import styles from "./TeacherLiveWord.module.css";
import axios from "../Common/api/authAxios";

const BASE_URL = "https://i9e206.p.ssafy.io";

const TeacherLiveWord = (props) => {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    return () => {};
  }, []);

  return (
    <div className={styles.main}>
      <div>
        <span className={styles.topic}>
          {props.$.state.curriculum.situation}
        </span>
      </div>
    </div>
  );
};

export default TeacherLiveWord;
