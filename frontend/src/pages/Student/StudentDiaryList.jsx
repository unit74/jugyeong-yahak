import React, { useCallback, useState, useEffect } from "react";
import styles from "./StudentMain.module.css";
import { useNavigate } from "react-router-dom";
import useTimeoutCallback from "../Common/hooks/useTimeoutCallback";
import TTSsentence from "../Common/TTSsentence";
import axios from "axios";

export default function StudentDiaryList() {
  const navigate = useNavigate();
  const [fade, setFade] = useState(false);
  const [diaries, setDiaries] = useState(null);

  useEffect(() => {
    async function getDiaries() {
      await axios.get(`https://i9e206.p.ssafy.io/api/v1/diaries`).then((response) => {
        setDiaries(response.data.data);
      });
    }
    getDiaries();
  }, []);

  useEffect(() => {
    if (diaries !== null) {
      console.log(diaries);
      console.log(diaries[0].imageUrl);
      console.log(diaries[0].content);
    }
  }, [diaries]);

  return (
    <div className={`${styles.main} ${fade ? styles.fadeOut : ""}`}>
      <div className={styles.square}>
        <div className={styles.greeting}>
          <b className={styles.b}>일기장 모아보기</b>
          {<TTSsentence message="일기장을 보아요" />}
          <button onClick={() => navigate("/")}>메인 화면</button>
        </div>
        {/*  */}
        <div className={styles.time}></div>
        {diaries &&
          diaries.map((diary, index) => (
            <div key={index}>
              <img src={diary.imageUrl}></img>
              {diary.content}
            </div>
          ))}
      </div>
    </div>
  );
}
