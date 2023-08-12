import React from "react";
import TeacherHeader from "./TeacherHeader";

const TeacherLiveReadWordHint = (props) => {
  const word = props.word;

  return (
    <div>
      <TeacherHeader />
      <main>
        <h1>읽기(초성 중성 종성 떼서 보여주는) 페이지</h1>
        <div>{word} 혼자학습에서 뗀거 긁어오면 될듯 ?</div>
      </main>
    </div>
  );
};

export default TeacherLiveReadWordHint;
