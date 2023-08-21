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
  const { diaryEntry, img } = location.state;
  // const userConversations = location.state && location.state.userConversations; // StudentTalking에서 프랍으로 넘겨주는것 받기!
  // const generatedDiary = location.state && location.state.generatedDiary;
  // const userDiary = location.state && location.state.diaryEntry; // StudentTalking에서 프랍으로 diaryEntry 넘겨주는것 받기!
  // const [isGenerating, setIsGenerating] = useState(false);
  // const [generatedText, setGeneratedText] = useState("");

  const [msg, setMsg] = useState(null);
  const [currentReadingIndex, setCurrentReadingIndex] = useState(-1); // 처음에는 아무 문장도 선택되지 않도록 -1을 초기값으로 설정

  // 온점일 때 줄 띄우기

  const formattedText =
    (diaryEntry &&
      diaryEntry
        .split(". ")
        .join(".\n")
        .split("! ")
        .join("!\n")
        .split("? ")
        .join("?\n")) ||
    "";

  // const navigateToRecordDictation = useCallback((navigate) => {
  //   navigate("/good-feedback", { state: { course: "diary" } });
  // }, []);

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

  // useTimeoutCallback(navigateToRecordDictation, 70000);

  useEffect(() => {
    console.log("UserDiary:", diaryEntry); //prop 잘 받아지는지 확인 - 일기 잘 받아진다.
    // setGeneratedText(diaryEntry); // 다이어리
    // generateText();
    // console.log(userConversations); //prop 잘 받아지는지 확인 - 배열로 잘 받아진다.
    return () => {};
  }, []);

  const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
  const data = formattedText.split(".\n");
  console.log("data:", data);

  // 임시로 막아둠
  useEffect(() => {
    console.log(formattedText);

    async function makeRequest(data) {
      await delay(5000);
      let text = "완성된 일기를 한 문장씩 따라 읽어요!!";
      ttsMaker(text);
      await delay(text.length * 200);

      // 일기 데이터 길이 만큼 반복
      for (let i = 0; i < data.length; i++) {
        ttsMaker(data[i], i, 0);
        await delay(data[i].length * 300);
      }

      navigate("/good-feedback", { state: { course: "diary" } });
    }

    if (data[0] !== "") {
      makeRequest(data);
    }

    return () => {};
  }, [formattedText, setCurrentReadingIndex, setMsg]);

  // useEffect(() => {
  //   ttsMaker("일기가 완성될 때까지 잠시만 기다려주세요.", -1, 0);
  // }, []);

  return (
    <div className={styles.main}>
      <div className={styles.square}>
        <div className={styles.theme}>
          {/* <img src={friends} alt="friends_img" /> */}
          <div className={styles.diaryContainer}>
            <img className={styles.row__diary} src={img} alt="" />
            <div>
              {data.map((sentence, index) => (
                <b
                  key={index}
                  className={
                    index === currentReadingIndex
                      ? `${styles.activeDiaryText} ${styles.diarytext}`
                      : styles.diarytext
                  }
                >
                  {sentence}
                </b>
              ))}
            </div>
          </div>
          {msg && <TTS message={msg} />}
        </div>
      </div>
    </div>
  );
}
