import React, { useState, useRef, useEffect } from "react";
import * as tmImage from "@teachablemachine/image";
import axios from "axios";

export default function FaceLogin() {
  const [predictions, setPredictions] = useState([]);
  const [isCaptured, setisCaptured] = useState(false);

  let videoRef = useRef(null);
  let photoRef = useRef(null);

  // Teachable Machine 모델 불러오기
  const modelURL = "https://teachablemachine.withgoogle.com/models/vjtO5zeXw/";
  const modelMetadataURL = modelURL + "metadata.json";

  let model, webcam;

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
    if (!isCaptured) {
      await predict(); // 이미지 예측 실행
    }
    window.requestAnimationFrame(loop);
  };

  // 웹캠으로부터 가져온 이미지를 모델로 예측
  const predict = async () => {
    const prediction = await model.predict(webcam.canvas);
    setPredictions(prediction);
    // console.log(predictions);
    const notebookClass = prediction.find((p) => p.className === "frontal");
    if (notebookClass && notebookClass.probability === 1) {
      console.log("정면");
    }
  };

  function dataURItoBlob(dataURI) {
    var byteString = atob(dataURI.split(",")[1]);
    var mimeString = dataURI.split(",")[0].split(":")[1].split(";")[0];
    var ab = new ArrayBuffer(byteString.length);
    var ia = new Uint8Array(ab);
    for (var i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }

    var bb = new Blob([ab], { type: "image/jpeg" });
    return bb;
  }

  const takePicture = () => {
    setisCaptured(true);

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
    console.log(data);
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
        console.log(response);
      })
      .catch((error) => console.error(`Error: ${error}`));
  };

  // useEffect(() => {
  //   console.log(predictions);
  // }, [predictions]);

  useEffect(() => {
    setupWebcam();
    initTeachableMachine();
  }, []);

  return (
    <div className="webcam-container">
      {/* 웹캠 화면을 보여주는 video 요소 */}
      <video className="container" ref={videoRef}></video>
      {/* 클래스 레이블을 표시하는 부분 */}
      <div id="label-container">
        {predictions.map((p, index) => (
          <div key={index}>{`${p.className}: ${p.probability.toFixed(2)}`}</div>
        ))}
      </div>
      <canvas ref={photoRef} width={500}></canvas>
      <button onClick={takePicture}>클릭해서 캡쳐하기</button>
    </div>
  );
}
