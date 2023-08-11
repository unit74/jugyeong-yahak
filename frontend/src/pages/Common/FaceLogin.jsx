import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styles from "../Student/StudentMain.module.css";
import axios from "axios";
import TTS from "../Common/TTS";
import "@mediapipe/face_detection";
import "@tensorflow/tfjs-core";
// Register WebGL backend.
import "@tensorflow/tfjs-backend-webgl";
import * as faceDetection from "@tensorflow-models/face-detection";
// import "./FaceLogin.css";

export default function FaceLogin() {
  // const [isCaptured, setisCaptured] = useState(true);
  const [fade, setFade] = useState(false);
  const [msg, setMsg] = useState(null);
  // const [count, setCount] = useState(0);

  const navigate = useNavigate();

  let videoRef = useRef(null);
  let photoRef = useRef(null);
  let isCaptured = useRef(false);

  let width = 500;
  let height = 500;

  let model;

  const ttsMaker = async (msg, timer) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        setMsg(msg);
        resolve();
      }, timer);
    });
  };

  const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  // 웹캠 세팅
  const setupWebcam = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      videoRef.current.srcObject = stream;
      // 비디오 로딩이 완료된 후에 play()를 호출합니다.
      videoRef.current.onloadedmetadata = () => {
        videoRef.current.play();
      };
    } catch (error) {
      console.log(error);
    }
  };

  // 계속 이미지 가져와
  const loop = async () => {
    if (isCaptured.current === true) {
      isCaptured.current = false;
      await drawToCanvas(); // 이미지 예측 실행
    }
    window.requestAnimationFrame(loop);
  };

  const estimateCanvas = async (photoRef) => {
    const estimationConfig = { flipHorizontal: false };
    const predictions = await model.estimateFaces(photoRef, estimationConfig);

    console.log(predictions);
    console.log(predictions[0]);
    // console.log(predictions[0].topLeft[0]);

    if (
      predictions[0] !== undefined &&
      predictions[0].box.xMin >= width / 4 &&
      predictions[0].box.yMin >= width / 4 &&
      predictions[0].box.xMax <= (3 * width) / 4 &&
      predictions[0].box.yMax <= (3 * width) / 4
    ) {
      if (
        predictions[0].box.width <= (1 * width) / 4 ||
        predictions[0].box.height <= (1 * width) / 4
      ) {
        ttsMaker("얼굴을 더 가까이 오세요!!", 0);
        setTimeout(() => {
          isCaptured.current = true;
        }, 5000);
        ttsMaker("", 0);
      } else {
        console.log("on Target");
        var dataUrl = photoRef.toDataURL("image/jpeg");
        var blob = dataURItoBlob(dataUrl);

        var formData = new FormData();
        formData.append("image", blob);

        login(formData);
      }
    } else {
      ttsMaker("얼굴을 칸에 맞춰주세요!!", 0);
      setTimeout(() => {
        isCaptured.current = true;
      }, 5000);
      ttsMaker("", 0);
    }

    return predictions;
  };

  const drawToCanvas = async () => {
    try {
      let width = 500;
      let height = 500;
      let photo = photoRef.current;
      let video = videoRef.current;

      photo.width = width;
      photo.height = height;

      let ctx = photo.getContext("2d");
      ctx.drawImage(video, 0, 0, photo.width, photo.height);

      const preds = await estimateCanvas(photo);

      for (let i = 0; i < preds.length; i++) {
        let p = preds[i];
        ctx.strokeStyle = "#FF0000";
        ctx.lineWidth = 5;
        ctx.strokeRect(p.box.xMin, p.box.yMin, p.box.xMax - p.box.xMin, p.box.yMax - p.box.yMin);
      }
    } catch (err) {
      console.log(err);
    }
  };

  function dataURItoBlob(dataURI) {
    var byteString = atob(dataURI.split(",")[1]);
    var ab = new ArrayBuffer(byteString.length);
    var ia = new Uint8Array(ab);
    for (var i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }

    var bb = new Blob([ab], { type: "image/jpeg" });
    return bb;
  }

  const login = (data) => {
    async function makeRequest() {
      let text = "로그인 실패!! 다시 얼굴을 맞춰주세요!!";
      ttsMaker(text, 0);
      await delay(text.length * 300);

      isCaptured.current = true;
      ttsMaker("", 0);
      // ttsMaker("다시 얼굴을 맞춰주세요!!", 0);
      // setTimeout(() => {
      //   isCaptured.current = true;
      // }, 5000);
    }

    const governmentId = 4;

    axios
      .post(`https://i9e206.p.ssafy.io/api/v1/auth/${governmentId}/login`, data, {
        headers: {
          accept: "*/*",
          "Content-Type": `multipart/form-data; boundary=${data._boundary}`,
        },
      })
      .then((response) => {
        console.log("login 성공");

        const role = response.data.data.info.role;
        // console.log(response);
        // teacher-main

        setTimeout(() => {
          setFade(true);

          localStorage.setItem("userInfo", JSON.stringify(response.data.data.info)); // userInfo 저장
          localStorage.setItem("accessToken", response.data.data.token); //토큰 저장

          navigate(role === "ROLE_STUDENT" ? "/" : "/teacher-main");
        }, 1000); // fadeout 후 이동
      })
      .catch((error) => {
        // setisCaptured(true);

        // ttsMaker("로그인 실패!!", 0);
        // setTimeout(() => {}, 2000);
        // ttsMaker("다시 얼굴을 맞춰주세요!!", 0);
        // setTimeout(() => {
        //   isCaptured.current = true;
        // }, 5000);
        makeRequest();

        console.error(`Error: ${error}`);
      });
  };

  // useEffect(() => {
  //   console.log(predictions);
  // }, [predictions]);

  useEffect(() => {
    const initFD = async () => {
      const model_1 = faceDetection.SupportedModels.MediaPipeFaceDetector;
      const detectorConfig = {
        runtime: "mediapipe",
        solutionPath: "https://cdn.jsdelivr.net/npm/@mediapipe/face_detection",
        // or 'base/node_modules/@mediapipe/face_detection' in npm.
      };
      model = await faceDetection.createDetector(model_1, detectorConfig);

      // await tf.setBackend("webgl");
      // model = await blazeface.load();
      console.log("model", model);

      window.requestAnimationFrame(loop);
    };
    initFD();
    setupWebcam();
    ttsMaker("얼굴을 중앙에 맞춰주세요.", 0);
    setTimeout(() => {
      isCaptured.current = true;
    }, 5000);
  }, []);

  return (
    // <div className={"webcam-container" ${fade ? styles.fadeOut : ""}}>
    <div className="App">
      <div className="video-line-container">
        <div className="video-wrapper">
          {/* 웹캠 화면을 보여주는 video 요소 */}
          <div>
            <video ref={videoRef} width={500} height={500}></video>
          </div>
        </div>
        <div className="line_1"></div>
        <div className="line_2"></div>
        <div className="line_3"></div>
        <div className="line_4"></div>
        <div className="line_5"></div>
        <div className="line_6"></div>
        <div className="line_7"></div>
        <div className="line_8"></div>
      </div>

      {/* 클래스 레이블을 표시하는 부분 */}
      {/* <div id="label-container">
    {predictions.map((p, index) => (
      <div key={index}>{`${p.className}: ${p.probability.toFixed(2)}`}</div>
    ))}
  </div> */}
      <div>
        <canvas ref={photoRef} width={500} style={{ display: "none" }}></canvas>
      </div>
      {/* <button onClick={takePicture}>클릭해서 캡쳐하기</button> */}
      {msg && (
        // <TTS message={`${userInfo.name}님, 안녕하세요! 지금은 혼자 학습 시간입니다.`} />
        <div>
          <TTS message={msg} />
        </div>
      )}
    </div>
  );
}
