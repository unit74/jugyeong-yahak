import React, { useEffect, useRef, useState } from "react";
import * as tmImage from "@teachablemachine/image";

const ImageClassification = () => {
  const [predictions, setPredictions] = useState([]);
  const [shouldTakePicture, setShouldTakePicture] = useState(true); // 캡쳐 여부를 나타내는 상태 변수
  const [logCount, setLogCount] = useState(0);

  let videoRef = useRef(null);
  let photoRef = useRef(null);

  // Teachable Machine 모델 불러오기
  const modelURL = "https://teachablemachine.withgoogle.com/models/4jyssp3L6/";
  const modelMetadataURL = modelURL + "metadata.json";

  let model, webcam, maxPredictions;

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
    maxPredictions = model.getTotalClasses();

    const flip = true; // 웹캠 화면 반전 여부 설정
    webcam = new tmImage.Webcam(200, 200, flip); // 웹캠 화면 크기 설정
    await webcam.setup(); // 웹캠 접근 권한 요청 및 설정
    await webcam.play(); // 웹캠 시작

    window.requestAnimationFrame(loop);
  };

  // 계속 이미지 가져와
  const loop = async () => {
    webcam.update(); // 웹캠 프레임 업데이트
    await predict(); // 이미지 예측 실행

    // logCount가 50 미만일 때만 loop 함수를 다시 호출합니다.
    if (logCount < 100) {
      window.requestAnimationFrame(loop);
    }
  };

  // 웹캠으로부터 가져온 이미지를 모델로 예측
  const predict = async () => {
    const prediction = await model.predict(webcam.canvas);
    setPredictions(prediction);

    // 예측 결과를 확인하여 공책을 들었으면 캡쳐
    // 캡쳐가 이루어지고 shouldTakePicture가 true인 경우에만 takePicture 함수 실행
    if (shouldTakePicture === true) {
      setShouldTakePicture(false); // 캡쳐가 이루어진 후에는 shouldTakePicture를 false로 설정하여 다음에 실행되지 않도록 함
      const notebookClass = prediction.find((p) => p.className === "1");
      if (notebookClass && notebookClass.probability === 1 && logCount < 50) {
        takePicture();
      }
    }
  };

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
    setLogCount((prevCount) => prevCount + 1); // logCount 상태 업데이트

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
    // Teachable Machine 모델 불러오기
    const modelURL =
      "https://teachablemachine.withgoogle.com/models/3aGvYcpsq/";
    const model = async () => {
      const model = await tmImage.load(
        modelURL + "model.json",
        modelURL + "metadata.json"
      );
      return model;
    };

    model().then((loadedModel) => {
      // 웹캠으로부터 이미지 캡쳐하여 분류 실행
      const webcam = new tmImage.Webcam(200, 200); // 웹캠 화면 크기 설정 (원하는 크기로 변경 가능)
      webcam.setup().then(() => {
        webcam.play();
        window.requestAnimationFrame(loop);
      });

      const loop = async () => {
        webcam.update();
        await predict(loadedModel, webcam.canvas);
        window.requestAnimationFrame(loop);
      };
    });
  }, []);

  const predict = async (model, imgElement) => {
    const prediction = await model.predict(imgElement);
    setPredictions(prediction);
  };

  return (
    <div className="webcam-container">
      {/* 웹캠 화면을 보여주는 video 요소 */}
      <video
        className="container"
        ref={videoRef}
        style={{ width: "100%", maxWidth: "600px" }}
        autoplay
      ></video>
      {/* 클래스 레이블을 표시하는 부분 */}
      <div id="label-container">
        {predictions.map((p, index) => (
          <li key={index}>{`${p.className}: ${p.probability.toFixed(4)}`}</li>
        ))}
      </div>
      <canvas
        ref={photoRef}
        style={{ width: "100%", maxWidth: "600px" }}
      ></canvas>
      <button onClick={takePicture}>클릭해서 캡쳐하기</button>
    </div>
  );
};
