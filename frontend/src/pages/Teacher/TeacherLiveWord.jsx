import React from "react";
import styles from "./TeacherLiveWord.module.css";

const TeacherLiveWord = (props) => {
  const curriculum = props.$.state.curriculum;

  const handleWord = (word) => {
    props.$.setState({
      word: word,
      page: 3,
    });
  };

  return (
    <div className={styles.main}>
      <div className={styles.buttonsContainer}>
        <button
          className={`${styles.button} ${styles.situationButton}`}
          onClick={() => {
            const data = {
              page: 2,
            };

            props.$.sendSignalInfo(data);
          }}
        >
          상황글 페이지로
        </button>
        {curriculum.wordList &&
          curriculum.wordList.map((word, i) => (
            <button
              className={`${styles.button} ${styles.wordButton}`}
              onClick={() => handleWord(word.word)}
              id="word"
              key={i}
            >
              {word.word}
            </button>
          ))}
        <button
          className={`${styles.button} ${styles.gameButton}`}
          onClick={() => {
            const data = {
              page: 11,
              quiz: true,
            };

            props.$.sendSignalInfo(data);
          }}
        >
          게임1 페이지로
        </button>
      </div>
    </div>
  );
};

export default TeacherLiveWord;
