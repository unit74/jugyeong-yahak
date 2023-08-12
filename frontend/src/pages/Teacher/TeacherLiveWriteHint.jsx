import React from "react";

const TeacherLiveWriteHint = (props) => {
  const word = props.word;

  return (
    <div>
      <main>
        <h1>받아쓰기(단어 보여줌) 페이지</h1>
        <div>{word}</div>
      </main>
    </div>
  );
};

export default TeacherLiveWriteHint;
