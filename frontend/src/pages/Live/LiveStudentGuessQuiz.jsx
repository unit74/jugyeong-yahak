import React from "react";
import { useOutletContext } from "react-router-dom";

const LiveStudentGuessQuiz = () => {
  const timer = useOutletContext().timer;

  return (
    <div>
      <h1>✔ 추리 퀴즈</h1>
      {timer > 0 && <div>{timer}</div>}
      <div>선생님의 설명을 듣고 단어를 받아쓰기를 통해 알아맞혀 봅시다.</div>
      <div>오늘 배운 단어 중에 문제가 나옵니다.</div>
    </div>
  );
};

export default LiveStudentGuessQuiz;
