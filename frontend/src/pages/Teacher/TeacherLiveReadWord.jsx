import React from "react";
import styles from "./TeacherLiveReadWord.module.css";

const TeacherLiveReadWord = (props) => {
  const word = props.word;

  return (
    <div>
      <h1>읽기(단어 띄워주는) 페이지</h1>
      <div>{word}</div>
    </div>
  );
};

export default TeacherLiveReadWord;
