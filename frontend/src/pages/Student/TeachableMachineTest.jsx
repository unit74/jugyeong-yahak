import React, { useEffect, useRef, useState } from "react";
import * as tmImage from "@teachablemachine/image";
import Predictor from "../Common/Predictor";

export default function TeachableMachine() {
  const [shouldTakePicture, setShouldTakePicture] = useState(true); // 캡쳐 여부를 나타내는 상태 변수
  const [webcam, setWebcam] = useState(null); // Predictor에서 초기화 안된 상태로 넘어가서 Predictor 자체는 렌더링 되지만,
  const [model, setModel] = useState(null); // webcam이나 model이 prop되지 않음

  let videoRef = useRef(null);
  let photoRef = useRef(null);

  // Teachable Machine 모델 불러오기
  const modelURL = "https://teachablemachine.withgoogle.com/models/4jyssp3L6/";
  const modelMetadataURL = modelURL + "metadata.json";

  let maxPredictions;

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
    const loadmodel = await tmImage.load(
      modelURL + "model.json",
      modelMetadataURL
    ); // model에서 const loadmodel로 바꾸고
    setModel(loadmodel); // 스테이트 저장
    // maxPredictions = model.getTotalClasses();

    const flip = true; // 웹캠 화면 반전 여부 설정
    const initializedWebcam = new tmImage.Webcam(200, 200, flip); // 웹캠 화면 크기 설정 // 마찬가지로 webcam에서 const ~~로 바꾸고 저장
    await initializedWebcam.setup(); // 웹캠 접근 권한 요청 및 설정
    await initializedWebcam.play(); // 웹캠 시작
    setWebcam(initializedWebcam);
  };

  // 계속 이미지 가져와
  // const loop = async () => {
  //   webcam.update(); // 웹캠 프레임 업데이트

  //   // logCount가 3 미만일 때만 loop 함수를 다시 호출합니다.
  //   if (logCount < 3) {
  //     window.requestAnimationFrame(loop);
  //   }
  // };

  // 사용자의 웹캠 화면을 캡쳐
  const takePicture = () => {
    let video = videoRef.current;
    let photo = photoRef.current;
    let width = 500;
    let height = width / (6 / 4);

    photo.width = width;
    photo.height = height;

    let ctx = photo.getContext("2d");
    ctx.drawImage(video, 0, 0, photo.width, photo.height);
    // 캡쳐한 이미지를 base64로 인코딩합니다.
    let capturedImageBase64 = photo.toDataURL("image/jpeg");
    console.log("OO");
    // logCount 상태 업데이트
    // console.log(logCount);

    // react-cloud-vision-api를 사용해 구글 visionAPI에 요청보냄
    // const vision = require('react-cloud-vision-api')
    // vision.init({auth: 'AIzaSyBuQAtfVF_9ojcI4iKLqg_lml4Am4fLat4'})
    // const req = new vision.Request({
    //   image: new vision.Image({
    //     base64: capturedImageBase64,
    //   }),
    //   features: [
    //     new vision.Feature('TEXT_DETECTION', 4),
    //   ],
    //   imageContext: {
    //     languageHints: ['ko'],
    //   },
    //   })

    //   // 응답받은 단어를 StudentAns에 저장
    //   vision.annotate(req).then((res) => {
    //       // handling response
    //       const StudentAns = res.responses[0]['textAnnotations'][0]['description']
    //       console.log(StudentAns)
    //     }, (e) => {
    //       console.log('Error: ', e)
    //     })
  };

  useEffect(() => {
    setupWebcam();
    initTeachableMachine();
  }, []);

  return (
    <div className="webcam-container">
      {/* 웹캠 화면을 보여주는 video 요소 */}
      <video
        className="container"
        ref={videoRef}
        style={{ width: "100%", maxWidth: "600px" }}
      ></video>
      {/* 클래스 레이블을 표시하는 부분 */}

      {webcam && model ? ( // webcam이랑 model이 초기화 안되면 Predictor는 안보여 줄거야
        <Predictor
          webcam={webcam}
          model={model}
          shouldTakePicture={shouldTakePicture}
          setShouldTakePicture={setShouldTakePicture}
          takePicture={takePicture}
        />
      ) : (
        <div>Loading...</div> // 로딩창 보여줄게
      )}

      <canvas
        ref={photoRef}
        style={{ width: "100%", maxWidth: "600px" }}
      ></canvas>
      <button onClick={takePicture}>클릭해서 캡쳐하기</button>
    </div>
  );
}
