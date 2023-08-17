import React from "react";
import { useOutletContext } from "react-router-dom";
import styles from "./LiveJournal.module.css";

const LiveJournal = () => {
  const curriculum = useOutletContext().curriculum;

  if (!curriculum) {
    return <div>Loading...</div>;
  }

  return (
    <div className={styles.situation}>
      <h1>{curriculum.situation}</h1>
      <div style={{ flex: "1" }}>
        <div style={{ flex: "1", display: "flex", justifyContent: "center" }}>
          <img className={styles.imgs} src={curriculum.themeImageUrl} alt="" />
        </div>
        <div className={styles.text}>{curriculum.situationJournal}</div>
      </div>
    </div>
  );
};

export default LiveJournal;
