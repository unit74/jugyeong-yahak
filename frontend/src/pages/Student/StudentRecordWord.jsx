import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./StudentRecordWord.module.css";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";

import { useDispatch, useSelector } from "react-redux";
import { fetchTheme } from "../../store/actions/themeAction";

import { useDebounce } from "../Common/hooks/useDebounce";
import speak from "../../assets/images/speak.png";
import TTS from "../Common/TTS";

export default function StudentRecordWord() {
  // DB에 저장된 단어 가져오기
  const dispatch = useDispatch();
  const wordsList = useSelector((state) => state.themeState.wordsList) || [];
  const wordIndex = useSelector((state) => state.wordIndexState.wordIndex);
  const [repeatValue, setRepeatValue] = useState(0); // prop을 새로 넣어줌으로써 TTS를 리렌더링 시킨다.

  // 음성인식 관련
  const { transcript, listening, browserSupportsSpeechRecognition } =
    useSpeechRecognition();

  // 녹음 카운터
  const [recordCounter, setRecordCounter] = useState(0);

  // 녹음된 답변들을 저장할 배열
  const [recordedTranscripts, setRecordedTranscripts] = useState([]);
  const debounceTerm = useDebounce(transcript, 2000);
  console.log(transcript, "transcript");

  // 들은 정답의 공백을 없앰
  const removeSpaces = (str) => str.replace(/\s/g, "");
  const normalizedDebounceTerm = removeSpaces(debounceTerm);

  useEffect(() => {
    if (debounceTerm) {
      setRecordedTranscripts((prev) => [...prev, normalizedDebounceTerm]);
      console.log("녹음됨!");
    } else {
      // 아무것도 녹음되지 않았을 때 공백을 배열에 추가
      setRecordedTranscripts((prev) => [...prev, ""]);
      console.log("녹음되지 않음!");
    }
  }, [debounceTerm]);

  useEffect(() => {
    const intervalsForRepeat = [8800, 16800]; // 처음은 word 불러오고 나면 실행 됨
    const timersForRepeat = intervalsForRepeat.map((interval) => {
      return setTimeout(() => {
        setRepeatValue((prev) => prev + 1);
      }, interval);
    });

    const startListeningWithDelay = (delay) => {
      return setTimeout(() => {
        SpeechRecognition.startListening();
        setRecordCounter((prevCounter) => prevCounter + 1); // 카운터 증가
      }, delay);
    };

    const intervalsForListening = [1800, 9800, 17800, 25800]; // 녹음은 3번하고 마지막 4번째는 카운트를 올려서 피드백실행 하려고 넣음
    const timersForListening = intervalsForListening.map((interval) => {
      return startListeningWithDelay(interval);
    });

    dispatch(fetchTheme());

    // 언마운트될 때, 모든 타이머 클리어
    return () => {
      [...timersForRepeat, ...timersForListening].forEach((timer) =>
        clearTimeout(timer)
      );
    };
  }, []);

  const navigate = useNavigate();

  useEffect(() => {
    console.log(recordedTranscripts);
    console.log(recordCounter);
    if (recordCounter === 4) {
      // 녹음 개수가 3이면 카운터는 4까지 해야함
      // 이럴거면 그냥 해도 되는거 아냐? 근데 또 다르게는 안고쳐지네 몇번할지는 나연이에게 토스
      if (
        recordedTranscripts.some(
          (transcript) => transcript === wordsList[wordIndex]?.word
        )
      ) {
        navigate("/good-feedback", { state: { course: "reading" } });
      } else {
        navigate("/bad-feedback", { state: { course: "reading" } });
      }
    }
  }, [recordCounter, recordedTranscripts, navigate]);

  return (
    <div className={styles.main}>
      <div className={styles.square}>
        <div className={styles.theme}>
          <img
            className={styles.wordimg}
            src={wordsList.length > 0 && wordsList[wordIndex].wordImageUrl}
            alt=""
          />

          <div className={styles.text}>
            <h1 className={styles.situationText}>
              {wordsList.length > 0 && wordsList[wordIndex].word}
            </h1>
          </div>
          <div>
            {wordsList[wordIndex].word && (
              <TTS repeat={repeatValue} message={wordsList[wordIndex].word} />
            )}
            {/* && 앞에 조건을 Redux에서 불러오는 걸로 해둬야 불러오기전에 TTS 실행을 안함 */}
          </div>
          <div className={styles.microphone}>
            <p className={styles.volume}>{listening ? "🔊" : "🔇"}</p>
            <p>{transcript}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
