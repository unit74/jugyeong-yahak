import React, { useCallback, useState, useEffect } from "react";
import styles from "./StudentMain.module.css";
import { useNavigate } from "react-router-dom";
import useTimeoutCallback from "../Common/hooks/useTimeoutCallback";
import TTSsentence from "../Common/TTSsentence";
import { Transition } from "react-transition-group";
import styled from "@emotion/styled";

export default function StudentMain() {
  const navigate = useNavigate();
  const [fade, setFade] = useState(false);
  const [userInfo, setUserInfo] = useState(JSON.parse(localStorage.getItem("userInfo")));
  const [msg, setMsg] = useState(null);

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
    async function makeRequest() {
      await delay(1000);

      let text = "";

      if (userInfo !== null) {
        text = `${userInfo.name} 어머님, 안녕하세요!`;
        // text = `어머님, 안녕하세요!`;
        ttsMaker(text, 0);
        await delay(text.length * 300);
      }

      text = "지금은 혼자 학습 시간입니다.";

      ttsMaker(text, 0);
      await delay(text.length * 300);

      text = "복습을 진행할려면 아래의 빨간 버튼을 누르세요.";

      ttsMaker(text, 0);
    }

    makeRequest();
  }, []);

  const navigateToRecordDictation = useCallback(() => {
    setFade(true);
    setTimeout(() => {
      navigate("/student-note");
    }, 1000); // fadeout 후 이동
  }, [navigate]);

  // useTimeoutCallback(navigateToRecordDictation, 10000); // 10초

  return (
    <div className={`${styles.main} ${fade ? styles.fadeOut : ""}`}>
      <div className={styles.square}>
        <div className={styles.greeting}>
          <b className={styles.b}>
            👋🏻 {userInfo === undefined ? "" : userInfo.name}님, 안녕하세요!
            {/* 어머님, 안녕하세요! */}
          </b>
          {msg && <TTSsentence message={msg} />}
        </div>
        {/*  */}
        <div className={styles.time}>
          <b className={styles.b2}>지금은</b>
          <b className={styles.b3}>혼자 학습 시간</b>
          {/* <b className={styles.b4}>시간</b> */}
          <button className={styles.clearButton} onClick={navigateToRecordDictation}>
            복습하기
          </button>
        </div>
      </div>
    </div>
  );
}
