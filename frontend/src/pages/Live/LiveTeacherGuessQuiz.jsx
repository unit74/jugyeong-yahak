import React, { useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";

const LiveTeacherGuessQuiz = () => {
  const [randomIdx, setRandomIdx] = useState(0);
  const curriculum = useOutletContext().curriculum;
  const wordList = curriculum.wordList || [];
  const timer = useOutletContext().timer;

  useEffect(() => {
    setRandomIdx(Math.floor(Math.random() * wordList.length));
    return () => {};
  }, [wordList]);

  return (
    <div>
      <h1>✔ 추리 게임 (교사 페이지)</h1>
      {timer > 0 && <div>{timer}</div>}
      <div>
        <div>오늘의 단어 : {wordList.length > 0 ? wordList[randomIdx].word : null}</div>
        <div>예시 설명 : {wordList.length > 0 ? wordList[randomIdx].wordExplanation : null}</div>
        <div>선생님의 설명을 듣고 단어를 받아쓰기를 통해 알아맞혀 봅시다.</div>
        <div>오늘 배운 단어 중에 문제가 나옵니다.</div>
      </div>
    </div>
  );
};

export default LiveTeacherGuessQuiz;
