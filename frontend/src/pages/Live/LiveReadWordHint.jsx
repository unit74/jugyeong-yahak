import React from "react";
import styles from "./LiveReadWordHint.module.css";
import { useOutletContext } from "react-router-dom";

function splitKorean(text) {
  const result = [];
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
}

const LiveReadWordHint = () => {
  const word = useOutletContext().word;
  const splittedText = splitKorean(word.word);

  return (
    <div className={styles.situation}>
      <h1>✔ 아래 단어를 소리내어 읽어봅시다.</h1>
      {splittedText.map((char, index) => (
        <div key={index} className={styles.text}>
          {char.chosung} + {char.jungsung} {char.jongsung && "+"}{" "}
          {char.jongsung} = {char.original}
        </div>
      ))}
    </div>
  );
};

export default LiveReadWordHint;
