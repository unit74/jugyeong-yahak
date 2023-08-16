import React, { useState, useCallback, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import styles from "./StudentSituation.module.css";
import useTimeoutCallback from "../Common/hooks/useTimeoutCallback";
import { useDispatch, useSelector } from "react-redux";
import { fetchTheme } from "../../store/actions/themeAction";
import friends from "../../assets/images/friends.png";
import { Configuration, OpenAIApi } from "openai";
import TTS from "../Common/TTSsentence";

// 예시영상 페이지
export default function StudentSituation() {
  // 변수
  const dispatch = useDispatch();
  const themeData = useSelector((state) => state.themeState.themeData) || {};
  const navigate = useNavigate();
  const location = useLocation();
  const message = location.state && location.state.message;

  const [msg, setMsg] = useState(null);
  const [currentReadingIndex, setCurrentReadingIndex] = useState(-1); // 처음에는 아무 문장도 선택되지 않도록 -1을 초기값으로 설정
 

  // 온점일 때 줄 띄우기
  const formattedDiary =
    themeData && themeData.situationJournal
    ? themeData.situationJournal.split(". ").map((s, idx, arr) => 
        idx !== arr.length - 1 ? s + "." : s // 마지막 문장은 .을 추가하지 않음
      ).join(".\n")
    : "";


  const ttsMaker = async (msg, index, timer) => {
    return new Promise((resolve) => {
        setTimeout(() => {
            setCurrentReadingIndex(index); // 현재 읽는 문장의 인덱스 설정
            setMsg(msg);
            resolve();
        }, timer);
    });
};


  // useEffect(() => {
  //   console.log(message);
  //   dispatch(fetchTheme());
  // }, [dispatch]);

  const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
  const data = formattedDiary.split(".\n");
  
  useEffect(() => {

    async function makeRequest(data) {
      await delay(5000);
      
      ttsMaker(data[0], 0, 0);
      await delay(data[0].length * 500);
      
      ttsMaker(data[1], 1, 0);
      await delay(data[1].length * 500);
      
      ttsMaker(data[2], 2, 0);
      await delay(data[2].length * 500);
      
      ttsMaker(data[3], 3, 0);
      await delay(data[3].length * 500);
      
      navigate("/reading-main");
   }

    if (data[0] !== "") {
      makeRequest(data);
    }

    return () => {};
  }, [formattedDiary, setCurrentReadingIndex, setMsg ]);

  useEffect(() => {
    ttsMaker("오늘의 이야기를 한 문장씩 따라 읽어요!!", -1, 0);
  }, []);

  return (
    <div className={styles.main}>
      <div className={styles.square}>
        <div className={styles.theme}>
          {data.map((sentence, index) => (
            <b 
              key={index} 
              className={index === currentReadingIndex ? `${styles.activeDiaryText} ${styles.diarytext}` : styles.diarytext}
            >
             {sentence}
            </b>
          ))}
          {msg && <TTS message={msg} />}
        </div>
      </div>
    </div>
  );
  
}
