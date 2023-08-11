import React, { useState, useCallback, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import styles from "./StudentDiary.module.css";
import useTimeoutCallback from "../Common/hooks/useTimeoutCallback";
import { useDispatch, useSelector } from "react-redux";
import { fetchTheme } from "../../store/actions/themeAction";
import friends from "../../assets/images/friends.png";
import { Configuration, OpenAIApi } from "openai";
import TTS from "../Common/TTSsentence";

// 예시영상 페이지
export default function StudentDiary() {
  // 변수
  const dispatch = useDispatch();
  const themeData = useSelector((state) => state.themeState.themeData) || {};
  const navigate = useNavigate();
  const location = useLocation();
  const generatedText = location.state?.generatedDiary || '';

  const [msg, setMsg] = useState(null);

  // 온점일 때 줄 띄우기
  const formattedText = (generatedText && generatedText && generatedText.split(". ").join(".\n")) || "";

  // const navigateToRecordDictation = useCallback((navigate) => {
  //   navigate("/good-feedback", { state: { course: "diary" } });
  // }, []);

  const ttsMaker = async (msg, timer) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        setMsg(msg);
        resolve();
      }, timer);
    });
  };



  const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  useEffect(() => {
    console.log(formattedText);

    const data = formattedText.split(".\n");

    async function makeRequest(data) {
      await delay(1000);

      ttsMaker(data[0], 0);
      await delay(data[0].length * 500);

      ttsMaker(data[1], 0);
      await delay(data[1].length * 500);

      ttsMaker(data[2], 0);
      await delay(data[2].length * 500);

      ttsMaker(data[3], 0);
      await delay(data[3].length * 500);
      // navigateToRecordDictation();
      navigate("/good-feedback", { state: { course: "diary" } });
    }

    if (formattedText !== "") {
      makeRequest(data);
    }

    return () => {};
  }, [formattedText]);


  useEffect(() => {
    ttsMaker("완성된 일기를 한 문장씩 따라 읽어요!!", 0);
  }, []);

  //함수
  // 1. API요청 함수
 
  return (
    <div className={styles.main}>
      <div className={styles.square}>
        <div className={styles.theme}>
          {/* <img src={friends} alt="friends_img" /> */}

            <b className={styles.diarytext}>{formattedText}</b>
          {msg && <TTS message={msg} />}
        </div>
      </div>
    </div>
  );
}
