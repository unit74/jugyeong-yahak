import React from "react";
import { useOutletContext } from "react-router-dom";
import styles from "./LiveReadWord.module.css";

const LiveWirteWordHint = () => {
  const word = useOutletContext().word;

  return (
    <div className={styles.situation}>
      <h1>✔ 아래 단어를 적어봅시다.</h1>
      <div className={styles.text}>{word.word}</div>
    </div>
  );
};

export default LiveWirteWordHint;
