import React, { useRef, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import CanvasDraw from "react-canvas-draw";
import html2canvas from "html2canvas";
import styles from "./CanvasTest.module.css";
import { useDispatch, useSelector } from "react-redux";
import { fetchTheme } from "../../store/actions/themeAction";

export default function CanvasTest() {
  // 변수
  const canvasRef = useRef(null); //캔버스
  const [studentAns, setStudentAns] = useState(""); //인식한 텍스트
  const wordsList = useSelector((state) => state.themeState.wordsList) || []; // 단어 목록
  const wordIndex = useSelector((state) => state.wordIndexState.wordIndex); // 현재 차례
  const [drawData, setDrawData] = useState(null);

  // 함수
  // 1. 그림 전체 지우기
  const handleClear = () => {
    if (canvasRef.current) {
      canvasRef.current.clear();
    }
  };

  // 2. 그림 캡쳐 후 OCR
  const handleDownload = async () => {
    // 그림 캡쳐
    if (canvasRef.current) {
      const canvas = await html2canvas(canvasRef.current.canvasContainer);
      const base64Image = canvas.toDataURL("image/png");
      setDrawData(canvasRef.current.getSaveData());

      // OCR (백으로 axios보내는 로직으로 수정 필)
      const vision = require("react-cloud-vision-api");
      vision.init({ auth: "AIzaSyBuQAtfVF_9ojcI4iKLqg_lml4Am4fLat4" });
      const req = new vision.Request({
        image: new vision.Image({
          base64: base64Image,
        }),
        features: [new vision.Feature("TEXT_DETECTION", 4)],
        imageContext: {
          languageHints: ["ko"],
        },
      });

      // 응답받은 단어를 StudentAns에 저장
      vision.annotate(req).then(
        (res) => {
          setStudentAns(res.responses[0]["textAnnotations"][0]["description"]);
          console.log(res.responses[0]["textAnnotations"][0]["description"]);
        },
        (e) => {
          console.log("Error: ", e);
        }
      );
    }
  };

  // useEffect
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    // 1. 정답 체크를 위해 현재 단어를 불러온다.
    dispatch(fetchTheme());

    // 2. OCR 결과가 들어오면, 정답과 비교하여 피드백해줌
    console.log(studentAns);
    if (studentAns) {
      if (studentAns === wordsList[wordIndex]?.word) {
        navigate("/good-feedback", { state: { course: "writing" } });
      } else {
        navigate("/dictation-feedback", {
          state: {
            course: "writing",
            // studentAnswer: studentAns,
            correctAnswer: wordsList[wordIndex]?.word,
            canvasData: drawData,
          },
        });
      }
    }
  }, [studentAns]);

  // DOM
  return (
    <div className={styles.canvasContainer}>
      <h1 className={styles.centeredHeading}>여기에 적어 보아요</h1>
      <CanvasDraw
        hideInterface
        className={styles.canvasDraw} // Apply the new style class
        ref={canvasRef}
        brushRadius={5}
        lazyRadius={12}
        canvasWidth={1200}
        canvasHeight={800}
      />
      <div className={styles.buttonContainer}>
        <button className={styles.clearButton} onClick={handleClear}>
          모두 지우기
        </button>
        <button className={styles.downloadButton} onClick={handleDownload}>
          다 적었어요
        </button>
        {/* <h1 className={styles.situationText}>{studentAns}</h1> */}
      </div>
    </div>
  );
}
