// npm install react-cloud-vision-api --save

import React, { useEffect, useRef } from 'react';


function WritingCamTest() {
  let videoRef = useRef(null);
  let photoRef = useRef(null);

  // 사용자의 웹캠에 접근 및 실행
  const getUserCamera = () => {
    navigator.mediaDevices
      .getUserMedia({ video: true })
      .then((stream) => {
        let video = videoRef.current;
        video.srcObject = stream;

        video.onloadedmetadata = () => {
          video.play();
        };
      })
      .catch((error) => {
        console.log(error);
      });
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
    getUserCamera();

    // 5초마다 자동으로 사진찍음 -> 절대 주석 해제 하지 마시오!!!!!!!!!!
    // const intervalId = setInterval(takePicture, 5000);

    // // 컴포넌트가 언마운트될 때 타이머를 정리 
    // return () => clearInterval(intervalId);
  }, []);



  return (
    <div className='container'>
      <video className='container' ref={videoRef}></video>
      <canvas ref={photoRef}  style={{ display: 'none' }}></canvas>
      {/* 나의 API 할당량 보호를 위해 테스트 시에는 버튼을 눌러서 캡쳐함 */}
      <button onClick={takePicture}>클릭해서 캡쳐하기</button>
    </div>
  );
}

export default WritingCamTest;
