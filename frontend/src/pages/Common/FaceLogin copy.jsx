import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styles from "../Student/StudentMain.module.css";
import * as tmImage from "@teachablemachine/image";
import axios from "axios";
import TTS from "../Common/TTS";
import * as tf from "@tensorflow/tfjs-core";
import "@tensorflow/tfjs-backend-webgl";
import * as blazeface from "@tensorflow-models/blazeface";

export default function FaceLogin() {
  const [predictions, setPredictions] = useState([]);
  // const [isCaptured, setisCaptured] = useState(true);
  const [fade, setFade] = useState(false);
  const [msg, setMsg] = useState(null);
  // const [count, setCount] = useState(0);

  const navigate = useNavigate();

  const ttsArray = [];

  let videoRef = useRef(null);
  let photoRef = useRef(null);
  let isCaptured = useRef(true);
  let count = useRef(0);

  // Teachable Machine 모델 불러오기
  const modelURL = "https://teachablemachine.withgoogle.com/models/vjtO5zeXw/";
  const modelMetadataURL = modelURL + "metadata.json";

  let model, webcam;

  const ttsMaker = async (msg, timer) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        setMsg(msg);
        resolve();
      }, timer);
    });
  };

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

  // Teachable Machine init 함수
  const initTeachableMachine = async () => {
    model = await tmImage.load(modelURL + "model.json", modelMetadataURL);

    const flip = true; // 웹캠 화면 반전 여부 설정
    webcam = new tmImage.Webcam(200, 200, flip); // 웹캠 화면 크기 설정
    await webcam.setup(); // 웹캠 접근 권한 요청 및 설정
    await webcam.play(); // 웹캠 시작

    window.requestAnimationFrame(loop);
  };

  // 계속 이미지 가져와
  const loop = async () => {
    webcam.update(); // 웹캠 프레임 업데이트
    if (isCaptured.current === true) {
      await predict(); // 이미지 예측 실행
    }
    window.requestAnimationFrame(loop);
  };

  // 웹캠으로부터 가져온 이미지를 모델로 예측
  const predict = async () => {
    const prediction = await model.predict(webcam.canvas);
    setPredictions(prediction);
    // const notebookClass = prediction.find((p) => p.className === "frontal");

    isCaptured.current = false;

    if (prediction[0].probability > 0.6) {
      takePicture();
    } else if (prediction[1].probability > 0.6) {
      ttsMaker("왼쪽으로 이동해주세요.", 0);
      setTimeout(() => {
        isCaptured.current = true;
      }, 4000);
    } else if (prediction[2].probability > 0.6) {
      // isCaptured.current = false;
      ttsMaker("오른쪽으로 이동해주세요.", 0);
      setTimeout(() => {
        isCaptured.current = true;
      }, 4000);
    } else {
      isCaptured.current = true;
    }

    // if (notebookClass && notebookClass.probability > 0.96) {
    //   // takePicture();
    //   console.log("정면");
    // }
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

  const takePicture = () => {
    // setisCaptured(false);

    // isCaptured.current = false;

    console.log(isCaptured);

    let width = 500;
    let height = width / (6 / 4);
    let photo = photoRef.current;
    let video = videoRef.current;

    photo.width = width;
    photo.height = height;

    let ctx = photo.getContext("2d");
    ctx.drawImage(video, 0, 0, photo.width, photo.height);

    var dataUrl = photo.toDataURL("image/jpeg");
    var blob = dataURItoBlob(dataUrl);

    var formData = new FormData();
    formData.append("image", blob);

    login(formData);
  };

  const login = (data) => {
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
        if (count.current === 0) {
          ttsMaker("로그인 실패! 얼굴을 중앙에 맞춰주세요.", 0);
          count.current += 1;
        } else if (count.current === 1) {
          ttsMaker("다시 로그인에 실패하였습니다. 얼굴을 중앙에 맞춰주세요", 0);
          count.current += 1;
        } else {
          ttsMaker("로그인이 되지 않습니다. 서비스를 다시 시작하세요.", 0);
        }

        console.log(count.current);

        setTimeout(() => {
          isCaptured.current = true;
        }, 5000);
        console.error(`Error: ${error}`);
      });
  };

  // useEffect(() => {
  //   console.log(predictions);
  // }, [predictions]);

  useEffect(() => {
    setupWebcam();
    initTeachableMachine();
    ttsMaker("얼굴을 중앙에 맞춰주세요.", 0);
  }, []);

  return (
    <div className={`"webcam-container" ${fade ? styles.fadeOut : ""}`}>
      {/* 웹캠 화면을 보여주는 video 요소 */}
      <video className="container" ref={videoRef}></video>
      {/* 클래스 레이블을 표시하는 부분 */}
      {/* <div id="label-container">
        {predictions.map((p, index) => (
          <div key={index}>{`${p.className}: ${p.probability.toFixed(2)}`}</div>
        ))}
      </div> */}
      <canvas ref={photoRef} width={500} style={{ display: "none" }}></canvas>
      {/* <button onClick={takePicture}>클릭해서 캡쳐하기</button> */}
      {msg && (
        // <TTS message={`${userInfo.name}님, 안녕하세요! 지금은 혼자 학습 시간입니다.`} />
        <TTS message={msg} />
      )}
    </div>
  );
}
