import React, { useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./StudentDiary.module.css";
import useTimeoutCallback from "../Common/hooks/useTimeoutCallback";

import { useDispatch, useSelector } from 'react-redux';
import { fetchTheme } from '../../store/actions/themeAction';

// 예시영상 페이지
export default function StudentDiary() {
  const dispatch = useDispatch();
  
  const themeData = useSelector((state) => state.themeState.themeData) || {}; 

  const navigate = useNavigate();

  const navigateToRecordDictation = useCallback((navigate) => {
    navigate("/good-feedback"); // 피드백 다시 연결 필요
  }, []);

  useTimeoutCallback(navigateToRecordDictation, 10000); // 10초

  useEffect(() => {
    dispatch(fetchTheme())
    // const timer = setTimeout(() => {
    //   navigate("/record-word");
    // }, 10000); // 10초

    
    // 언마운트 됐을시 타이머 클리어
    return () => {
      // clearTimeout(timer);
    };
  }, [navigate]);
  console.log(themeData.situationJournal)
  return (
    <div className={styles.main}>
      <div className={styles.square}>
        <div className={styles.theme}>
          <h1>{themeData && themeData.situationJournal}</h1>
        </div>
      </div>
    </div>
  );
}
