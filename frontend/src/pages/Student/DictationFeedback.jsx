import React, { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import styles from "./DictationFeedback.module.css";
import TTSsentence from "../Common/TTSsentence";

import { useDispatch, useSelector } from "react-redux";
import { setWordIndex } from "../../store/actions/setWordIndexAction";
import CanvasDraw from "react-canvas-draw";

export default function DictaionFeedback() {
  const dispatch = useDispatch();
  const location = useLocation();
  const { course, studentAnswer, correctAnswer, canvasData } = location.state;
  const navigate = useNavigate();
  const canvasRef = useRef(null); //캔버스

  const [msg, setMsg] = useState(null);
  const [loadedCanvasData, setLoadedCanvasData] = useState(canvasData);

  const wordIndex = useSelector((state) => state.wordIndexState.wordIndex);

  // 함수
  // 1. 그림 전체 지우기
  const handleClear = () => {
    if (canvasRef.current) {
      canvasRef.current.clear();
    }
  };

  // 다음 페이지
  const nextPage = () => {
    navigate("/good-feedback", { state: { course: "writing" } });
  };

  const ttsMaker = async (msg, timer) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        setMsg(msg);
        resolve();
      }, timer);
    });
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      if (course === "writing" && wordIndex < 4) {
        ttsMaker("다른 단어를 배워볼까요?", 0);
        setTimeout(() => {
          dispatch(setWordIndex());
          navigate("/review-word");
        }, 3500);
      } else if (course === "writing" && wordIndex === 4) {
        ttsMaker("이제 일기를 써볼까요?", 0);
        setTimeout(() => {
          navigate("/diary-main");
        }, 3500);
      }
    }, 5000); // 5초

  //   // 언마운트 될 시 타이머 클리어
  //   return () => {
  //     clearTimeout(timer);
  //   };
  // }, [course, navigate]);

  return (
    <div className={styles.main}>
      <div className={styles.square}>
        {course === "writing" && (
          <>
            <div className={styles.canvasContainer}>
              <h1 className={styles.centeredHeading}>{correctAnswer}</h1>
              <CanvasDraw
                hideInterface
                className={styles.canvasDraw} // Apply the new style class
                ref={canvasRef}
                saveData={loadedCanvasData}
                brushRadius={5}
                lazyRadius={12}
                canvasWidth={1200}
                canvasHeight={800}
              />
              <div className={styles.buttonContainer}>
                <button className={styles.clearButton} onClick={handleClear}>
                  모두 지우기
                </button>
                <button className={styles.nextButton} onClick={nextPage}>
                  완료
                </button>
                {/* <h1 className={styles.situationText}>{studentAns}</h1> */}
              </div>
            </div>
            {msg && <TTSsentence message={msg} />}
          </>
        )}
        {/* </div> */}
      </div>
    </div>
  );
  })
}