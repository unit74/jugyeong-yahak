import React from "react";
import { useOutletContext } from "react-router-dom";

const LiveJournal = () => {
  const curriculum = useOutletContext().curriculum;

  return (
    <div>
      <h1>{curriculum.situation}</h1>
      <img src={curriculum.themeImageUrl} alt="" />
      <div>{curriculum.situationJournal}</div>
    </div>
  );
};

export default LiveJournal;
