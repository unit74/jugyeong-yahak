import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./StudentRecordWord.module.css";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";
import { useDispatch, useSelector } from "react-redux";
import { Configuration, OpenAIApi } from "openai";
import listenImg from "../../assets/images/listening_man.png";
import TTSsentence from "../Common/TTSsentence";
import CLOVA from "../Common/CLOVA";

export default function StudentRecordWord() {
  // DB에 저장된 단어 가져오기
  const wordsList = useSelector((state) => state.themeState.wordsList) || [];
  // const wordIndex = useSelector((state) => state.wordIndexState.wordIndex);
  const wordIndex = 4;

  // 음성인식 관련
  const { transcript, listening } = useSpeechRecognition();

  // TTS 관련
  const [count, setCount] = useState(0);
  const [msg, setMsg] = useState(null);
  // const [jamoAnswer, setJamoAnswer] = useState(null);

  const ttsMaker = async (msg, timer) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        setMsg(msg);
        resolve();
      }, timer);
    });
  };

  const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  // function getConstantVowel(kor) {
  //   const f = [
  //     "ㄱ",
  //     "ㄲ",
  //     "ㄴ",
  //     "ㄷ",
  //     "ㄸ",
  //     "ㄹ",
  //     "ㅁ",
  //     "ㅂ",
  //     "ㅃ",
  //     "ㅅ",
  //     "ㅆ",
  //     "ㅇ",
  //     "ㅈ",
  //     "ㅉ",
  //     "ㅊ",
  //     "ㅋ",
  //     "ㅌ",
  //     "ㅍ",
  //     "ㅎ",
  //   ];
  //   const s = [
  //     "ㅏ",
  //     "ㅐ",
  //     "ㅑ",
  //     "ㅒ",
  //     "ㅓ",
  //     "ㅔ",
  //     "ㅕ",
  //     "ㅖ",
  //     "ㅗ",
  //     "ㅘ",
  //     "ㅙ",
  //     "ㅚ",
  //     "ㅛ",
  //     "ㅜ",
  //     "ㅝ",
  //     "ㅞ",
  //     "ㅟ",
  //     "ㅠ",
  //     "ㅡ",
  //     "ㅢ",
  //     "ㅣ",
  //   ];
  //   const t = [
  //     "",
  //     "ㄱ",
  //     "ㄲ",
  //     "ㄳ",
  //     "ㄴ",
  //     "ㄵ",
  //     "ㄶ",
  //     "ㄷ",
  //     "ㄹ",
  //     "ㄺ",
  //     "ㄻ",
  //     "ㄼ",
  //     "ㄽ",
  //     "ㄾ",
  //     "ㄿ",
  //     "ㅀ",
  //     "ㅁ",
  //     "ㅂ",
  //     "ㅄ",
  //     "ㅅ",
  //     "ㅆ",
  //     "ㅇ",
  //     "ㅈ",
  //     "ㅊ",
  //     "ㅋ",
  //     "ㅌ",
  //     "ㅍ",
  //     "ㅎ",
  //   ];

  //   const ga = 44032;
  //   let uni = kor.charCodeAt(0);

  //   uni = uni - ga;

  //   let fn = parseInt(uni / 588);
  //   let sn = parseInt((uni - fn * 588) / 28);
  //   let tn = parseInt(uni % 28);

  //   return {
  //     f: f[fn],
  //     s: s[sn],
  //     t: t[tn],
  //   };
  // }

  useEffect(() => {
    async function makeRequest(data) {
      await delay(1000);

      ttsMaker(data, 0);
      await delay(data.length * 250);
      ttsMaker("", 0);

      SpeechRecognition.startListening();
      await delay(4000);
      SpeechRecognition.stopListening();

      setCount(count + 1);
    }

    async function work(data) {
      if (data === wordsList[wordIndex].word) {
        navigate("/good-feedback", { state: { course: "reading" } });
      } else {
        // if (count == 1) {
        //   let answer = "";

        //   for (let char of wordsList[wordIndex].word) {
        //     let jamo = getConstantVowel(char); // 각 문자 출력
        //     answer += jamo.f + ", " + jamo.s;
        //     if (jamo.t !== "") {
        //       answer += ", " + jamo.t;
        //     }
        //     answer += "가 결합되어 " + char + ", ";
        //   }

        //   answer = answer.substr(0, answer.length - 2);
        //   answer += " 합쳐서 " + wordsList[wordIndex].word + "로 발음됩니다.";
        //   setJamoAnswer(answer);

        //   // let text = `이 단어의 뜻은 ${wordsList[wordIndex].wordExplanation}입니다.`;
        //   ttsMaker(answer, 0);
        //   await delay(answer.length * 250);
        // }
        setCount(count + 1);
      }
    }

    if (count === 0) {
      makeRequest("단어를 읽어주세요!!");
      console.log(transcript);
    } else if (count === 1) {
      work(transcript);
      console.log(transcript);
    } else if (count === 2) {
      // setJamoAnswer(null);
      makeRequest("다시 단어를 읽어주세요!!");
    } else if (count === 3) {
      work(transcript);
    } else if (count === 4) {
      makeRequest(`단어를 같이 읽어요!!! ${wordsList[wordIndex].word} `);
    } else {
      navigate("/good-feedback", { state: { course: "reading" } });
    }
  }, [count]);

  const navigate = useNavigate();
  console.log(wordsList[wordIndex]);
  return (
    <div className={styles.main}>
      <div className={styles.square}>
        <div className={styles.theme}>
          <div className={styles.listenImg}>
            {listening && <img src={listenImg} alt="listenImg" />}
          </div>
          <div className={styles.situationText}>
            {wordsList.length > 0 && wordsList[wordIndex].word}
          </div>
          <p className={styles.transcriptText}>{transcript}</p>
          {msg && <CLOVA message={msg} />}
          {/* <div>{jamoAnswer}</div> */}
        </div>
      </div>
    </div>
  );
}
