import React from "react";
import TeacherHeader from "./TeacherHeader";

const TeacherLiveSituation = (props) => {
  const img = props.img;
  const situation = props.situation;
  const situationJournal = props.situationJournal;

  return (
    <div>
      <TeacherHeader />
      <main>
        <h1>상황글 페이지</h1>
        <img src={img} alt="" />
        <div>{situation}</div>
        <div>{situationJournal}</div>
      </main>
    </div>
  );
};

export default TeacherLiveSituation;
