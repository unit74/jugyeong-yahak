import React from "react";
import TeacherHeader from "./TeacherHeader";

const TeacherLiveReadWord = (props) => {
  const word = props.word;

  return (
    <div>
      <TeacherHeader />
      <main>
        <h1>읽기(단어 띄워주는) 페이지</h1>
        <div>{word}</div>
      </main>
    </div>
  );
};

export default TeacherLiveReadWord;
