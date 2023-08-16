import React, { useEffect, useState } from "react";
// import styles from "./TeacherLiveGuessQuiz.module.css";

const TeacherLiveGuessQuiz = (props) => {
  const [randomIdx, setRandomIdx] = useState(0);
  const wordList = props.$.state.curriculum.wordList;

  useEffect(() => {
    setRandomIdx(Math.floor(Math.random() * wordList.length));
    return () => {};
  }, [wordList]);

  return (
    <div>
      <h1>추리 게임 진행 페이지</h1>
      <div>
        <div>오늘의 단어 : {wordList[randomIdx].word}</div>
        <div>예시 설명 : {wordList[randomIdx].wordExplanation}</div>

        <button
          onClick={() => {
            props.$.sendSignalQuiz({ quiz: true });
          }}
        >
          퀴즈 시작
        </button>

        <button
          onClick={() => {
            props.$.sendSignalQuiz({ quiz: false });
          }}
        >
          (개발용) 걍 다음 잘했어요 페이지로
        </button>
        <button
          onClick={() => {
            props.$.setState({ timer: 0 }, () => {
              props.$.sendSignalQuiz({ quiz: false });
            });
          }}
        >
          (개발용) 걍 다음 아쉬워요 페이지로
        </button>
      </div>
    </div>
  );
};

export default TeacherLiveGuessQuiz;
