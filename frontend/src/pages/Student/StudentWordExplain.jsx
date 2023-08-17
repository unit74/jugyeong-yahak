import React, { useState, useEffect } from "react";
import styles from "./StudentWordExplain.module.css";
import { useDispatch, useSelector } from "react-redux";
import TTS from "../Common/TTSsentence";
import { useNavigate } from "react-router-dom";
// 다른 필요한 모듈들을 import

export default function StudentWordExplain() {
  // DB에 저장된 단어 가져오기
  const wordsList = useSelector((state) => state.themeState.wordsList) || [];
  const wordIndex = useSelector((state) => state.wordIndexState.wordIndex);

  const [msg, setMsg] = useState(null);
  const [currentReadingIndex, setCurrentReadingIndex] = useState(-1); // 처음에는 아무 문장도 선택되지 않도록 -1을 초기값으로 설정
  const [separatedCharacters, setSeparatedCharacters] = useState([]);

  const navigate = useNavigate();

  const ttsMaker = async (msg, index, timer) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        setCurrentReadingIndex(index); // 현재 읽는 문장의 인덱스 설정
        console.log("Current Reading Index:", currentReadingIndex);
        setMsg(msg);
        resolve();
      }, timer);
    });
  };

  useEffect(() => {
    const result = renderSeparatedCharacters(wordsList[wordIndex].word);
    setSeparatedCharacters(result);

    console.log(result);

    async function makeRequest(result) {
      await delay(2000);
      let text = "단어를 설명해드려요!!";
      ttsMaker(text);
      await delay(text.length * 200);
      const middleMapping = {
        ㅏ: "아",
        ㅐ: "애",
        ㅑ: "야",
        ㅒ: "얘",
        ㅓ: "어",
        ㅔ: "에",
        ㅕ: "여",
        ㅖ: "예",
        ㅗ: "오",
        ㅘ: "와",
        ㅙ: "왜",
        ㅚ: "외",
        ㅛ: "요",
        ㅜ: "우",
        ㅝ: "워",
        ㅞ: "외",
        ㅟ: "위",
        ㅠ: "유",
        ㅡ: "으",
        ㅢ: "의",
        ㅣ: "이",
      };

      for (let i = 0; i < result.length; i++) {
        if (result[i].jungsung) {
          result[i].jungsungText =
            middleMapping[result[i].jungsung] || result[i].jungsung;
        }
      }

      console.log(result);
      for (let i = 0; i < result.length; i++) {
        let tts = result[i].chosung + ", " + result[i].jungsungText;
        if (result[i].jongsung !== "") {
          tts += ", " + result[i].jongsung;
        }
        tts += "가 결합되어 " + result[i].original + "!";
        console.log(tts);
        ttsMaker(tts, i, 0);
        await delay(tts.length * 500);
      }

      navigate("/record-word");
    }

    if (result[0] !== "") {
      makeRequest(result);
    }

    return () => {};
  }, [wordsList, setCurrentReadingIndex]);

  const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  // 초중종 분리 및 표시 함수
  const renderSeparatedCharacters = (text) => {
    const korBegin = 44032; // '가'
    const chosungBase = 588;
    const jungsungBase = 28;

    const chosungs = [
      "ㄱ",
      "ㄲ",
      "ㄴ",
      "ㄷ",
      "ㄸ",
      "ㄹ",
      "ㅁ",
      "ㅂ",
      "ㅃ",
      "ㅅ",
      "ㅆ",
      "ㅇ",
      "ㅈ",
      "ㅉ",
      "ㅊ",
      "ㅋ",
      "ㅌ",
      "ㅍ",
      "ㅎ",
    ];
    const jungsungs = [
      "ㅏ",
      "ㅐ",
      "ㅑ",
      "ㅒ",
      "ㅓ",
      "ㅔ",
      "ㅕ",
      "ㅖ",
      "ㅗ",
      "ㅘ",
      "ㅙ",
      "ㅚ",
      "ㅛ",
      "ㅜ",
      "ㅝ",
      "ㅞ",
      "ㅟ",
      "ㅠ",
      "ㅡ",
      "ㅢ",
      "ㅣ",
    ];
    const jongsungs = [
      "",
      "ㄱ",
      "ㄲ",
      "ㄳ",
      "ㄴ",
      "ㄵ",
      "ㄶ",
      "ㄷ",
      "ㄹ",
      "ㄺ",
      "ㄻ",
      "ㄼ",
      "ㄽ",
      "ㄾ",
      "ㄿ",
      "ㅀ",
      "ㅁ",
      "ㅂ",
      "ㅄ",
      "ㅅ",
      "ㅆ",
      "ㅇ",
      "ㅈ",
      "ㅊ",
      "ㅋ",
      "ㅌ",
      "ㅍ",
      "ㅎ",
    ];

    const result = [];

    for (const char of text) {
      const code = char.charCodeAt(0);

      const subCode = code - korBegin;
      const chosungIndex = parseInt(subCode / chosungBase);
      const jungsungIndex = parseInt(
        (subCode - chosungIndex * chosungBase) / jungsungBase
      );
      const jongsungIndex = parseInt(subCode % jungsungBase);

      result.push({
        original: char,
        chosung: chosungs[chosungIndex],
        jungsung: jungsungs[jungsungIndex],
        jongsung: jongsungs[jongsungIndex] || "",
      });
    }

    return result;
  };

  const thisWord = wordsList[wordIndex].word;

  return (
    <div className={styles.main}>
      <div className={styles.square}>
        <h1 className={styles.situationText}>{thisWord}</h1>
        {separatedCharacters.map((char, index) =>
          index === currentReadingIndex ? (
            <div key={index} className={styles.maging}>
              <p className={styles.wordComponent}>
                {char.chosung} {char.jungsung} {char.jongsung}
              </p>
              <p className={styles.wordComponent}>{char.original}</p>
            </div>
          ) : null
        )}
        {msg && <TTS message={msg} />}
      </div>
    </div>
  );
}
