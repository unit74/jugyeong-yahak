import React, { useState, useEffect } from "react";
import styles from "./StudentWordExplain.module.css";
import { useDispatch, useSelector } from "react-redux";
// 다른 필요한 모듈들을 import

export default function StudentWordExplain() {
  // DB에 저장된 단어 가져오기
  const wordsList = useSelector((state) => state.themeState.wordsList) || [];
  const wordIndex = useSelector((state) => state.wordIndexState.wordIndex);

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
  const thisWord = wordsList[wordIndex].word
  const separatedCharacters = renderSeparatedCharacters(thisWord);
  

  return (
    <div className={styles.main}>
       <div className={styles.square}>
      <h1 className={styles.situationText}>{thisWord}</h1>
      {separatedCharacters.map((char, index) => (
        <div key={index}>
         <p className={styles.wordComponent}> 
          {char.chosung}  {char.jungsung}  {char.jongsung}
          </p>
         <p className={styles.wordComponent}> 
         {char.original}
          </p>
        </div>
      ))}
      </div>
    </div>
  );
}

