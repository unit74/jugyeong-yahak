import React, { useCallback, useEffect, useState } from "react";
import styles from "./StudentMain.module.css";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import useTimeoutCallback from "../Common/hooks/useTimeoutCallback";
import axios from "axios";
import { FETCH_THEME_SUCCESS } from "../../store/actions/types";

export default function StudentMain() {
  const navigate = useNavigate();
  const [fade, setFade] = useState(false);
  const dispatch = useDispatch();

  const [msg, setMsg] = useState(null);

  const themeData = useSelector((state) => state.themeState.themeData);

  const navigateToRecordDictation = useCallback(() => {
    setFade(true);
    setTimeout(() => {
      navigate("/");
    }, 1000); // fadeout 후 이동
  }, [navigate]);

  // useTimeoutCallback(navigateToRecordDictation, 15000); // 10초

  const ttsMaker = async (msg, timer) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        setMsg(msg);
        resolve();
      }, timer);
    });
  };

  const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  // 복습완료 후 상태 변경해줘야됨
  useEffect(() => {
    async function makeRequest(data) {
      await axios.post(`https://i9e206.p.ssafy.io/api/v1/themes/review/${data}`);

      await delay(1000);

      dispatch({
        type: FETCH_THEME_SUCCESS,
        payload: { themeData: null, wordsList: null },
      });

      setFade(true);
      await delay(1000);
      navigate("/");
    }

    if (themeData !== null) {
      console.log(themeData.id);
      makeRequest(themeData.id);
    }
  }, []);

  return (
    <div className={`${styles.main} ${fade ? styles.fadeOut : ""}`}>
      <div className={styles.square}>
        <div className={styles.greeting}>
          <b className={styles.b}>여기는 책장</b>
        </div>
      </div>
    </div>
  );
}
