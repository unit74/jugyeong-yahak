import React from "react";
import styles from "./TeacherLiveSituation.module.css";

const TeacherLiveSituation = (props) => {
  const img = props.img;
  const situation = props.situation;
  const situationJournal = props.situationJournal;

  return (
    <div className={styles.main}>
      <h1>상황글 페이지</h1>
      <img src={img} alt="" />
      <div>{situation}</div>
      <div>{situationJournal}</div>
    </div>
  );
};

export default TeacherLiveSituation;
