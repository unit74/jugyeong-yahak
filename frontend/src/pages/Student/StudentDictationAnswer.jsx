import React, { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./StudentDictationAnswer.module.css";
import useTimeoutCallback from "../Common/hooks/useTimeoutCallback";
import TTS from "../Common/TTS";

// import TeachableMachineTest from "./TeachableMachineTest";
import CanvasTest from "./CanvasTest";

// OCR 페이지
export default function StudentDictationAnswer() {
  return (
    <div className={styles.main}>
      <div className={styles.square}>
        {/* <TeachableMachineTest /> */}
        <TTS message={"단어를 써주세요!!"} />
        <CanvasTest />
      </div>
    </div>
  );
}
