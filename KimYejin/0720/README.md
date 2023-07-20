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
import React, { useEffect, useRef } from "react";
import * as handpose from "@tensorflow-models/handpose";
import * as tf from "@tensorflow/tfjs";

const HandDetection = () => {
  let model;
  const camera = useRef();
  const figures = useRef();

  const run = async () => {
    model = await handpose.load();

    const webcam = await tf.data.webcam(camera.current, {
      resizeWidth: 870,
      resizeHeight: 534,
    });
    while (true) {
      const img = await webcam.capture();
      const result = await model.estimateHands(img);

      if (figures.current) {
        figures.current.innerText =
          result.length > 0 ? "궁금한게 있어요✋🏻✋🏻" : "아직 궁금한게 없어요";
      }

      img.dispose();

      await tf.nextFrame();
    }
  };

  useEffect(() => {
    if (camera.current) {
      (async function start() {
        await run();
      })();
    }
  }, [camera.current]);

  const styles = {
    fontSize: "24px",
  };

  return (
    <>
      <div ref={figures} style={styles}></div>
      <video
        autoPlay
        playsInline
        muted={true}
        ref={camera}
        width="870"
        height="534"
        onLoadedMetadata={(e) => e.target.play()}
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

`HandDetection`이라는 메인 컴포넌트를 만들고 `useEffect`와 `useRef`를 사용하여 웹캠과 TensorFlow.js 연동을 처리했다. 모션 인식 과정은 TensorFlow.js의 `handpose` 모델을 이용해 웹캠 영상을 분석하고 손 위치와 움직임을 결과로 반환했다. 이 결과를 따라서 텍스트를 업데이트하여 손 영역에 따른 반응을 구현했다. 

웹캠에서 구동시킨거라 openvidu에서는 어떻게 인식할 수 있을지에 대한 부분은 아직 많은 고민이 필요하다. 내일부터 이 부분에 대해서 추가로 살펴볼 예정이다.






