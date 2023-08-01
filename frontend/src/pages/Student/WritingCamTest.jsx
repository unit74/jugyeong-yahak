import React, { useEffect, useRef } from 'react';

// npm install react-cloud-vision-api --save

function WritingCamTest() {
  let videoRef = useRef(null);
  let photoRef = useRef(null);

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

  const takePicture = () => {
    let width = 500;
    let height = width / (6 / 4);
    let photo = photoRef.current;
    let video = videoRef.current;

    photo.width = width;
    photo.height = height;

    let ctx = photo.getContext('2d');
    ctx.drawImage(video, 0, 0, photo.width, photo.height);

    // 이미지를 base64로 인코딩합니다.
    let capturedImageBase64 = photo.toDataURL('image/jpeg');
    console.log('Captured Image (Base64):', capturedImageBase64);

    const vision = require('react-cloud-vision-api')
    vision.init({auth: 'AIzaSyBuQAtfVF_9ojcI4iKLqg_lml4Am4fLat4'})
    const req = new vision.Request({
      image: new vision.Image({
        base64: capturedImageBase64,
      }),
      features: [
        new vision.Feature('TEXT_DETECTION', 4),
        new vision.Feature('LABEL_DETECTION', 10),
      ]
    })

    vision.annotate(req).then((res) => {
        // handling response
        console.log(JSON.stringify(res.responses))
      }, (e) => {
        console.log('Error: ', e)
      })
    
  };


  useEffect(() => {
    getUserCamera();

    // 1초마다 takePicture 함수를 호출하도록 설정
    const intervalId = setInterval(takePicture, 10000);

    // 컴포넌트가 언마운트될 때 타이머를 정리
    return () => clearInterval(intervalId);
  }, []);


        

  return (
    <div className='container'>
      <h1>selfie App in React.js</h1>
      hello world
      <video className='container' ref={videoRef}></video>
      <canvas ref={photoRef}></canvas>
    </div>
  );
}

export default WritingCamTest;
