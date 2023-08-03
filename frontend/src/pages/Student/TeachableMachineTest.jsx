import React, { useEffect, useRef, useState } from 'react';
import * as tmImage from '@teachablemachine/image';

export default function TeachableMachine() {
  const [predictions, setPredictions] = useState([]);
  const [gotPicture, setGotPicture] = useState(false); // 캡쳐 여부를 나타내는 상태 변수

  let videoRef = useRef(null);
  let photoRef = useRef(null);

  // Teachable Machine 모델 불러오기
  const modelURL = 'https://teachablemachine.withgoogle.com/models/4jyssp3L6/';
  const modelMetadataURL = modelURL + 'metadata.json';

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
    model = await tmImage.load(modelURL + 'model.json', modelMetadataURL);
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
    window.requestAnimationFrame(loop);
  };

  // 웹캠으로부터 가져온 이미지를 모델로 예측
  const predict = async () => {
    const prediction = await model.predict(webcam.canvas);
    setPredictions(prediction);

    const notebookClass = prediction.find((p) => p.className === '1');
    if (notebookClass && notebookClass.probability == 1) {
      if (gotPicture === false){
        takePicture();
      }
    }
  };
  
  // 사용자의 웹캠 화면을 캡쳐
  const takePicture = () => {
    let width = 500;
    let height = width / (6 / 4);
    let photo = photoRef.current;
    let video = videoRef.current;
    
    photo.width = width;
    photo.height = height;
    
    let ctx = photo.getContext('2d');
    ctx.drawImage(video, 0, 0, photo.width, photo.height);
    // 캡쳐한 이미지를 base64로 인코딩합니다.
    let capturedImageBase64 = photo.toDataURL('image/jpeg');
    console.log('찍었어요')
    // .then(() => setGotPicture(true))
    

    // react-cloud-vision-api를 사용해 구글 visionAPI에 요청보냄
    const vision = require('react-cloud-vision-api')
    vision.init({auth: 'AIzaSyBuQAtfVF_9ojcI4iKLqg_lml4Am4fLat4'})
    const req = new vision.Request({
      image: new vision.Image({
        base64: capturedImageBase64,
      }),
      features: [
        new vision.Feature('TEXT_DETECTION', 4),
      ],
      imageContext: {
        languageHints: ['ko'],
      },
    })

    // 응답받은 단어를 StudentAns에 저장
    vision.annotate(req).then((res) => {
        // handling response
        const StudentAns = res.responses[0]['textAnnotations'][0]['description']
        console.log(StudentAns)
      }, (e) => {
        console.log('Error: ', e)
      })
  };



  useEffect(() => {
    setupWebcam();
    initTeachableMachine();
  }, []);

  return (
    <div className='webcam-container'>
      {/* 웹캠 화면을 보여주는 video 요소 */}
      <video className='container' ref={videoRef}></video>
      {/* 클래스 레이블을 표시하는 부분 */}
      <div id="label-container">
        {predictions.map((p, index) => (
          <div key={index}>{`${p.className}: ${p.probability.toFixed(2)}`}</div>
        ))}
      </div>
      <canvas ref={photoRef} width={500} ></canvas>
      <button onClick={takePicture}>클릭해서 캡쳐하기</button>
    </div>
  );
}