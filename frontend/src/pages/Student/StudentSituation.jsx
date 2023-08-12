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
export default function StudentSituation() {
  // 변수
  const dispatch = useDispatch();
  const themeData = useSelector((state) => state.themeState.themeData) || {};
  const navigate = useNavigate();
  const location = useLocation();
  const message = location.state && location.state.message;
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedText, setGeneratedText] = useState("");

  const [msg, setMsg] = useState(null);

  // 온점일 때 줄 띄우기
  const formattedDiary =
    (themeData &&
      themeData.situationJournal &&
      themeData.situationJournal.split(". ").join(".\n")) ||
    "";

  const ttsMaker = async (msg, timer) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        setMsg(msg);
        resolve();
      }, timer);
    });
  };

  useEffect(() => {
    console.log(message);
    dispatch(fetchTheme());
  }, [dispatch]);

  const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  useEffect(() => {
    console.log(formattedDiary);

    const data = formattedDiary.split(".\n");

    async function makeRequest(data) {
      await delay(5000);

      ttsMaker(data[0], 0);
      await delay(data[0].length * 500);

      ttsMaker(data[1], 0);
      await delay(data[1].length * 500);

      ttsMaker(data[2], 0);
      await delay(data[2].length * 500);

      ttsMaker(data[3], 0);
      await delay(data[3].length * 500);


      // navigateToRecordDictation();
      navigate("/reading-main");
    }

    if (data[0] !== "") {
      makeRequest(data);
    }

    return () => {};
  }, [formattedDiary]);

  useEffect(() => {
    ttsMaker("오늘의 이야기를 한 문장씩 따라 읽어요!!", 0);
  }, []);

  return (
    <div className={styles.main}>
      <div className={styles.square}>
        <div className={styles.theme}>
          {/* <img src={friends} alt="friends_img" /> */}
          <b className={styles.diarytext}>{formattedDiary}</b>
          {/* msg && 앞에 해줘야 2번 안읽음 */}
          {/* TTS가 자기혼자 null이라고 말함 */}
          {msg && <TTS message={msg} />}
        </div>
      </div>
    </div>
  );
}
