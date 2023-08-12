import React from "react";
import styles from "./TeacherCurriculum.module.css";
import TeacherHeader from "./TeacherHeader";

const TeacherLiveWord = (props) => {
  const curriculum = props.$.state.curriculum;

  const handleWord = (word) => {
    props.$.setState({
      word: word,
      page: 3,
    });
  };

  return (
    <div className={styles.ipadPro1115}>
      <TeacherHeader />
      <main className={styles.main}>
        <div>
          <button
            onClick={() => {
              props.$.setState(
                {
                  page: 2,
                },
                () => {
                  props.$.sendSignalInfo({
                    page: props.$.state.page,
                  });
                }
              );
            }}
          >
            상황글 페이지로
          </button>
          {curriculum.wordList &&
            curriculum.wordList.map((word, i) => (
              <button
                className={styles.word}
                onClick={() => handleWord(word.word)}
                id="word"
                key={i}
              >
                {word.word}
              </button>
            ))}
          <button
            onClick={() => {
              props.$.setState(
                {
                  page: 11,
                },
                () => {
                  props.$.sendSignalInfo({
                    page: props.$.state.page,
                  });
                }
              );
            }}
          >
            게임1 페이지로
          </button>
        </div>
      </main>
    </div>
  );
};

export default TeacherLiveWord;
