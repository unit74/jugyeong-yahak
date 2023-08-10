import React, { useEffect, useCallback, useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./StudentDictationAnswer.module.css";
import useTimeoutCallback from "../Common/hooks/useTimeoutCallback";
import TTS from "../Common/TTS";
import { useDispatch, useSelector } from "react-redux";
import { fetchTheme } from "../../store/actions/themeAction";
import CanvasTest from "./CanvasTest";

// OCR 페이지
export default function StudentDictationAnswer() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const wordsList = useSelector((state) => state.themeState.wordsList) || [];
  const wordIndex = useSelector((state) => state.wordIndexState.wordIndex);
  const repeatValue = 3;

  useEffect(() => {
    dispatch(fetchTheme());
  }, []);

  return (
    <div className={styles.main}>
      <div className={styles.square}>
        {/* <TeachableMachineTest /> */}
        <TTS message={wordsList[wordIndex].word} />
        <TTS message={wordsList[wordIndex].word} />
        <TTS message={wordsList[wordIndex].word} />
        <CanvasTest />
      </div>
    </div>
  );
}
