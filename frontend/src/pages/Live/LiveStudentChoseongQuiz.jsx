import React from "react";
import { useOutletContext } from "react-router-dom";

const LiveStudentChoseongQuiz = () => {
  const choseong = useOutletContext().choseong;

  return (
    <div>
      <h1>초성 퀴즈</h1>
      <div>
        <div>오늘의 초성 : {choseong}</div>
        <div>초성을 보고 초성에 맞는 단어를 맞혀봅시다.</div>
      </div>
    </div>
  );
};

export default LiveStudentChoseongQuiz;
