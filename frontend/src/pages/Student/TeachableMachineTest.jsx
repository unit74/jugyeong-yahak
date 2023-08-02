import React, { useEffect, useState, useRef } from "react";
import * as tmImage from "@teachablemachine/image";

const ImageClassification = () => {
  const [predictions, setPredictions] = useState([]);
  const videoRef = useRef(null); // 웹캠 비디오 요소를 위한 ref

  useEffect(() => {
    // Teachable Machine 모델 불러오기
    const modelURL = "https://teachablemachine.withgoogle.com/models/3aGvYcpsq/";
    const model = async () => {
      const model = await tmImage.load(modelURL + "model.json", modelURL + "metadata.json");
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
    <div>
    <video ref={videoRef} width="200" height="200" autoPlay></video>
      <h2>이미지 분석 결과:</h2>
      <ul>
        {predictions.map((p, index) => (
          <li key={index}>
            {`${p.className}: ${p.probability.toFixed(4)}`}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ImageClassification;
