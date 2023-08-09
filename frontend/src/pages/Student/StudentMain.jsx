import React, { useCallback, useState, useEffect } from "react";
import styles from "./StudentMain.module.css";
import { useNavigate } from "react-router-dom";
import useTimeoutCallback from "../Common/hooks/useTimeoutCallback";
import Audio from "../Common/Audio";
import TTS from "../Common/TTS";

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

  useEffect(() => {
    ttsMaker(`${userInfo.name}님, 안녕하세요!`, 0);
    ttsMaker("지금은 혼자 학습 시간입니다.", 3500);
  }, []);

  const navigateToRecordDictation = useCallback(() => {
    setFade(true);
    setTimeout(() => {
      navigate("/review-theme");
    }, 1000); // fadeout 후 이동
  }, [navigate]);

  useTimeoutCallback(navigateToRecordDictation, 10000); // 10초

  return (
    <div className={`${styles.main} ${fade ? styles.fadeOut : ""}`}>
      <div className={styles.square}>
        <div className={styles.greeting}>
          <b className={styles.b}>
            👋🏻 {userInfo === undefined ? "" : userInfo.name}님, 안녕하세요!
          </b>
          {msg && <TTS message={msg} />}
        </div>
        {/*  */}
        <div className={styles.time}>
          <b className={styles.b2}>지금은</b>
          <b className={styles.b3}>혼자 학습</b>
          <b className={styles.b4}>시간</b>
        </div>
      </div>
    </div>
  );
}
