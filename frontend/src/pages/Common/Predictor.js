import React from "react";
import { useEffect } from "react";
import { useState } from "react";

export default function Predictor({ webcam, model, shouldTakePicture, takePicture, logCount }) {
  const [predictions, setPredictions] = useState([]);

  const predict = async () => {
    if (!webcam || !model) return; // webcam이나 model이 없으면 함수를 종료
    const prediction = await model.predict(webcam.canvas);
    setPredictions(prediction);

    const notebookClass = prediction.find((p) => p.className === "ok");
    if (notebookClass && notebookClass.probability >= 0.9) {
      // 캡쳐 로직 추가
      takePicture(); // 여기에서 takePicture 함수 실행
    }
  };

  useEffect(() => {
    let predictTimeout; // setTimeout의 반환 값을 저장할 변수
    let logCount = 0;

    const webcamLoop = () => {
      if (webcam) {
        // 웹캠은 계속해서 업데이트 해도 될듯? 끊기게 해도 되면 밑의 1초간격 호출을 써보자
        webcam.update();
        window.requestAnimationFrame(webcamLoop); // 일단 이렇게 부르면 cpu부담이 크다
        // 그리고 안드로이드나 ios에서 안될수도?
      }
    };

    const predictLoop = async () => {
      // 동작맞추는 함수를 겁나 많이 불러대니까 분리해서 호출하자
      if (webcam && model && logCount < 30) {
        logCount++; // 이걸로 고친거면 따로 컴포넌트 만들 필요가 없나?
        console.log("logCount:", logCount);
        await predict();
        predictTimeout = setTimeout(predictLoop, 2000); // 1초 간격으로 predictLoop 함수 호출
      } else {
        clearTimeout(predictTimeout); // logCount가 3 이상이거나 필요한 조건을 만족하지 않을 때 타이머를 취소
      }
    };

    webcamLoop();
    predictLoop();

    return () => {
      // cleanup 함수: setTimeout을 취소하여 마무리합니다.
      clearTimeout(predictTimeout);
    };
  }, [webcam, model, shouldTakePicture, logCount]);

  return (
    <div id="label-container">
      {/* <div>Testing Predictor Rendering</div> 렌더링 되는지 확인용으로 해봤는데 렌더링은 되었음 */}
      {/* 그런데 부모 Teacheble에서 webcam과 model이 초기화 안된상태에서 prop을 줘서 밑의 코드가 작동을 안한듯함 */}
      {/* {predictions.map((p, index) => (
            <div key={index}>{`${p.className}: ${p.probability.toFixed(2)}`}</div>
          ))} */}
    </div>
  );
}
