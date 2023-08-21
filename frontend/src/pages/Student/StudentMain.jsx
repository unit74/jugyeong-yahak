import React, { useCallback, useState, useEffect } from "react";
import styles from "./StudentMain.module.css";
import { useNavigate } from "react-router-dom";
import useTimeoutCallback from "../Common/hooks/useTimeoutCallback";
import TTSsentence from "../Common/TTSsentence";
import { Transition } from "react-transition-group";
import styled from "@emotion/styled";
import { useDispatch } from "react-redux";

import liveImg from "../../assets/images/live.png";
import reviewImg from "../../assets/images/studentreview.png";
import diaryImg from "../../assets/images/diary.png";
import { setGender } from "../../store/actions/setGenderAction";

export default function StudentMain() {
  const navigate = useNavigate();
  const [fade, setFade] = useState(false);
  const [userInfo, setUserInfo] = useState(
    JSON.parse(localStorage.getItem("userInfo"))
  );
  const [msg, setMsg] = useState(null);
  const dispatch = useDispatch();

  const ttsMaker = async (msg, timer) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        setMsg(msg);
        resolve();
      }, timer);
    });
  };

  // let lectureTime = null;
  // let lectureTimes = lectureTime && lectureTime.split(",");

  const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  useEffect(() => {
    async function makeRequest() {
      await delay(1000);

      let text = "";

      if (userInfo !== null) {
        dispatch(setGender(userInfo.gender));
        let gender = userInfo.gender === 0 ? "어머님" : "아버님";
        console.log(userInfo.gender);
        console.log(gender);

        // text = `${userInfo.name} 어머님, 안녕하세요!`;
        text = `${userInfo.name} ${gender}, 안녕하세요!`;
        ttsMaker(text, 0);
        await delay(text.length * 300);
      }

      text = "지금은 혼자 학습 시간입니다.";

      ttsMaker(text, 0);
      await delay(text.length * 300);

      // text = "복습을 진행하시려면 아래의 빨간 버튼을 누르세요.";

      // ttsMaker(text, 0);
    }

    makeRequest();
  }, []);

  // 복습시작
  const navigateToRecordDictation = useCallback(() => {
    setFade(true);
    setTimeout(() => {
      navigate("/student-note");
    }, 1000);
  }, [navigate]);

  const navigateToLive = useCallback(() => {
    setFade(true);
    setTimeout(() => {
      navigate("/student-live");
    }, 1000);
  }, [navigate]);

  const navigateToDiaryList = useCallback(() => {
    setFade(true);
    setTimeout(() => {
      navigate("/diary-list");
    }, 1000); // fadeout 후 이동
  }, [navigate]);

  // 현재 시간
  const currentTime = new Date();
  const currentMinutes = currentTime.getHours() * 60 + currentTime.getMinutes();

  // 강의 시작 시간
  // const lectureTime = userInfo && userInfo.lectureTime;
  const lectureTime =
    userInfo && userInfo.role === "ROLE_STUDENT"
      ? userInfo.lectureTime
      : "10:00:00";
  const lectureTimeParts = userInfo && lectureTime.split(":");
  const lectureStartMinutes =
    userInfo &&
    parseInt(lectureTimeParts[0], 10) * 60 + parseInt(lectureTimeParts[1], 10);

  // 강의 시작 30분 전의 시간
  const lecturePreStartMinutes = lectureStartMinutes - 30;

  // 강의 종료 1시간 후의 시간
  const lectureEndMinutes = lectureStartMinutes + 60;

  // 조건 확인
  const showEnterClass =
    currentMinutes >= lecturePreStartMinutes &&
    currentMinutes < lectureEndMinutes;

  return (
    <div className={`${styles.main} ${fade ? styles.fadeOut : ""}`}>
      <div className={styles.square}>
        <div className={styles.greeting}>
          <b className={styles.b}>
            {userInfo === null ? "" : userInfo.name}님, 안녕하세요!
            {/* 어머님, 안녕하세요! */}
          </b>
          {msg && <TTSsentence message={msg} />}
        </div>
        {showEnterClass ? (
          <div className={styles.time}>
            <div className={styles.timeImg}>
              <img
                className={styles.responsive_image}
                src={liveImg}
                alt="liveImg"
              />
            </div>
            <button className={styles.clearButton} onClick={navigateToLive}>
              교실에 들어가기
            </button>
          </div>
        ) : (
          <div className={styles.time}>
            <div className={styles.timeImg}>
              <img
                className={styles.responsive_image}
                src={reviewImg}
                alt="reviewImg"
              />
            </div>
            <button
              className={styles.clearButton}
              onClick={navigateToRecordDictation}
            >
              혼자 공부하기
            </button>
          </div>
        )}
        <div className={styles.time}>
          <div className={styles.timeImg}>
            <img
              className={styles.responsive_image}
              src={diaryImg}
              alt="diaryImg"
            />
          </div>
          <button className={styles.diaryButton} onClick={navigateToDiaryList}>
            일기장 보기
          </button>
        </div>
      </div>
    </div>
  );
}
