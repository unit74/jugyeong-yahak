import React, { useCallback, useState, useEffect, useRef } from "react";
import styles from "./StudentDiaryList.module.css";
import { useNavigate } from "react-router-dom";
import useTimeoutCallback from "../Common/hooks/useTimeoutCallback";
import TTSsentence from "../Common/TTSsentence";
import axios from "axios";

const BASE_HTTP_URL = process.env.REACT_APP_BASE_HTTP_URL;

export default function StudentDiaryList() {
  const navigate = useNavigate();
  const [fade, setFade] = useState(false);
  const [diaries, setDiaries] = useState(null);
  const sliderRef = useRef(null);
  // const [msg, setMsg] = useState(null);

  useEffect(() => {
    async function getDiaries() {
      await axios.get(`${BASE_HTTP_URL}/diaries`).then((response) => {
        setDiaries(response.data.data);
      });
    }
    getDiaries();
  }, []);

  useEffect(() => {
    // let timeoutId;
    if (diaries && diaries.length > 0) {
      // setMsg("일기장을 보아요");
      console.log(diaries);
      console.log(diaries[0].imageUrl);
      console.log(diaries[0].content);
    }
    // else {
    //   setMsg("일기장이 없어요, 혼자학습을 시작해요");
    //   timeoutId = setTimeout(() => {
    //     navigate("/student-note");
    //   }, 5000);
    // }

    // return () => {
    //   clearTimeout(timeoutId);
    // };
  }, [diaries]);

  function formatDiaryContent(content) {
    if (!content) return "";
    return content.split(". ").join(".\n").split("! ").join("!\n").split("? ").join("?\n");
  }

  return (
    <div className={`${styles.main} ${fade ? styles.fadeOut : ""}`}>
      <div className={styles.square}>
        <div className={styles.greeting}>
          <b className={styles.b}>일기장 모아보기</b>
          <TTSsentence message={"일기장을 보아요"} />
          <button className={styles.mainButton} onClick={() => navigate("/")}>
            돌아가기
          </button>
        </div>
        {/*  */}
        <div className={styles.slider}>
          <div
            className={styles.slider__arrow__left}
            onClick={() => {
              sliderRef.current.scrollLeft -= window.innerWidth * (85 / 100); // scrollLeft는 왼쪽의 픽셀을 가져온다
            }}
          >
            <span className={styles.arrow}>{"<"}</span>
          </div>
          <div className={styles.row__diarys} ref={sliderRef}>
            {diaries &&
              [...diaries].reverse().map((diary, index) => (
                // 최신순으로 보기위해서 reverse 원래 배열 보존위해 복사[...diaries] 해서 사용
                <div className={styles.diaryContainer} key={index}>
                  <img className={styles.row__diary} src={diary.imageUrl} />
                  <div className={styles.diaryContent}>
                    {formatDiaryContent(diary.content)
                      .split("\n")
                      .map((line, i) => (
                        <div key={i}>{line}</div>
                      ))}
                  </div>{" "}
                </div>
              ))}
          </div>

          <div
            className={styles.slider__arrow__right}
            onClick={() => {
              sliderRef.current.scrollLeft += window.innerWidth * (85 / 100); // scrollLeft는 왼쪽의 픽셀을 가져온다
            }}
          >
            <span className={styles.arrow}>{">"}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
