import React from "react";
import { useOutletContext } from "react-router-dom";

const LiveWriteWord = () => {
  const word = useOutletContext().word;

  return (
    <div>
      <h1>✔ 불러주는 단어를 공책에 적어봅시다.</h1>
    </div>
  );
};

export default LiveWriteWord;
