import React from "react";
import styles from "./LiveReadWord.module.css";
import { useOutletContext } from "react-router-dom";

const LiveReadWord = () => {
  const word = useOutletContext().word;

  return (
    <div>
      <h1>✔ 아래 단어를 소리내어 읽어봅시다.</h1>
      <div>{word}</div>
    </div>
  );
};

export default LiveReadWord;
