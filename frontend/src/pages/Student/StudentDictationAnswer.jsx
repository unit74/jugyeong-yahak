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
  const [repeatValue, setRepeatValue] = useState(0); // prop을 새로운 값을 넣어줌으로써 TTS를 리렌더링 시킨다.

  const wordsList = useSelector((state) => state.themeState.wordsList) || [];
  const wordIndex = useSelector((state) => state.wordIndexState.wordIndex);

  useEffect(() => {
    const intervalsForRepeat = [4000, 8000]; // 처음은 word 불러오고 나면 실행 되니까 두번만 적어도 3번말하는거임
    // 4000 = 4000ms = 4초
    const timersForRepeat = intervalsForRepeat.map((interval) => {
      return setTimeout(() => {
        setRepeatValue((prev) => prev + 1); // repeat value를 바꿔줘서 리렌더링 시키는 것!
      }, interval);
    });

    dispatch(fetchTheme());

    // 언마운트 시 타이머 초기화
    return () => {
      [...timersForRepeat].forEach((timer) => clearTimeout(timer));
    };
  }, []);

  return (
    <div className={styles.main}>
      <div className={styles.square}>
        {/* <TeachableMachineTest /> */}
        {wordsList[wordIndex].word && (
          <TTS repeat={repeatValue} message={wordsList[wordIndex].word} />
        )}
        <CanvasTest />
      </div>
    </div>
  );
}
