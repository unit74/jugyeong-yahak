# TensorFlow와 웹캠을 사용한 손 인식 (손들기 기능)

### 1️⃣ 초기 설정

```bash
npm i @tensorflow/tfjs @tensorflow-models/handpose
```

`@tensorflow/tfjs`: TensorFlow.js 라이브러리

`@tensorflow-models/handpose`: 손 인식에 사용되는 TensorFlow handpose 모델

### 2️⃣

`App.jsx`에 라우터 설정 / `index.js`에 <BrowserRouter> 설정

```javascript
import React, { useEffect } from "react";
import * as handpose from "@tensorflow-models/handpose";
import * as tf from "@tensorflow/tfjs";

// HandDetection 컴포넌트
const HandDetection = () => {
  let model;
  const camera = React.useRef();
  const figures = React.useRef();
  const webcamElement = camera.current;

  const run = async () => {
    model = await handpose.load();

    // 웹캠 설정
    const webcam = await tf.data.webcam(webcamElement, {
      resizeWidth: 870,
      resizeHeight: 534,
    });
    while (true) {
      // 이미지 캡쳐
      const img = await webcam.capture();
      // 모델을 사용하여 손 추정
      const result = await model.estimateHands(img);
      // 메세지 표시
      if (figures.current) {
        figures.current.innerText =
          result.length > 0 ? "궁금한게 있어요✋🏻✋🏻" : "아직 궁금한게 없어요";
      }

      img.dispose();

      await tf.nextFrame();
    }
  };

  // 컴포넌트가 마운트될 때 실행되는 useEffect 훅
  useEffect(() => {
    if (camera.current) {
      run();
    }
  }, [camera.current]);

  return (
    <>
      <div ref={figures}></div>
      <video
        autoPlay
        playsInline
        muted={true}
        ref={camera}
        width="870"
        height="534"
      />
    </>
  );
};

export default HandDetection;
```

### 3️⃣ 추가 해결 사항

✔ 비디오 로딩 시간, 딜레이 시간 해결 필요 ➡ 이건 openvidu로 변경 후 수정해 볼 예정..

✔ 궁금한 점이 있을 때 손을 드는 행위를 `손`을 감지하는 것이 괜찮은지 .. 

### 구현 결과

![](C:\Users\SSAFY\AppData\Roaming\marktext\images\2023-07-20-11-54-26-image%20(1).png)

![](C:\Users\SSAFY\AppData\Roaming\marktext\images\2023-07-20-11-54-19-image.png)

---


