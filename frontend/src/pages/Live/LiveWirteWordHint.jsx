import React from "react";
import { useOutletContext } from "react-router-dom";

const LiveWirteWordHint = () => {
  const word = useOutletContext().word;

  return (
    <div>
      <h1>✔ 아래 단어를 적어봅시다.</h1>
      <div>{word.word}</div>
    </div>
  );
};

export default LiveWirteWordHint;
