const express = require("express");
const faceapi = require("face-api.js");
const { Canvas, Image } = require("canvas");
const canvas = require("canvas");
const fileUpload = require("express-fileupload");
require("dotenv").config();

faceapi.env.monkeyPatch({ Canvas, Image }); //node에서 canvas 사용 가능

const app = express();

//훅테스트
app.use(
  //req에서 file 찾기 위해 설정
  fileUpload({
    useTempFiles: true,
  })
);

async function LoadModels() {
  // 모델 로드 -> 최초 한번만 되도록 faceapi가 관리

  await faceapi.nets.ssdMobilenetv1.loadFromDisk("./models");
  await faceapi.nets.faceLandmark68Net.loadFromDisk("./models");
  await faceapi.nets.faceRecognitionNet.loadFromDisk("./models");
}
LoadModels();

async function getDescriptorsFromDB(tempImage, labels, folder) {
  const image = await canvas.loadImage(tempImage);

  // DB 얼굴과 라벨을 매칭합니다.
  const labeledFaceDescriptors = await loadLabeledImage(labels, folder);
  //유사도 낮을수록 엄격 -> 원래 0.6 => 일론머스크, 김민재, 이강인 있었는데, 박지성 로그인됨
  const faceMatcher = new faceapi.FaceMatcher(labeledFaceDescriptors, 0.4);

  // 사진에서 얼굴을 식별합니다.
  const detections = await faceapi.detectAllFaces(image).withFaceLandmarks().withFaceDescriptors();

  return detections.map((d) => faceMatcher.findBestMatch(d.descriptor));
}

app.post("/check-face", async (req, res) => {
  //console.log(req);
  console.log(req.body);

  //req에 Face라는 Key로 파일을 보낼 것임
  //let image = req.body.Face.tempFilePath; //이미지가 null이면 죽는다 -> 따로 체크 해줘야할듯
  const { imageUrl } = req.body;

  const obj = JSON.parse(JSON.stringify(req.body)); // req.body = [object: null prototype] { title: 'product' }

  console.log(obj);

  const cleanedUrl = obj.face.slice(1, -1);

  const labels = JSON.parse(obj.labels);

  const folder = JSON.parse(obj.folder);

  let result = await getDescriptorsFromDB(cleanedUrl, labels, folder);

  res.json({ result });
});

const BASE_URL = process.env.IMAGE_URL;

function loadLabeledImage(labels, folder) {
  return Promise.all(
    labels.map(async (label) => {
      const description = [];

      console.log("loadImage전까지 오는지?");

      console.log(`${BASE_URL}/${folder}/${label}.png`);

      const img = await canvas.loadImage(`${BASE_URL}/${folder}/${label}.png`);

      console.log("왔나?" + label);

      const detections = await faceapi
        .detectSingleFace(img)
        .withFaceLandmarks()
        .withFaceDescriptor();

      description.push(detections.descriptor);

      console.log("loadLabel 끝");

      return new faceapi.LabeledFaceDescriptors(label, description);
    })
  );
}

const port = process.env.PORT || 3000; // 환경 변수에서 포트를 가져오거나 기본값으로 3000을 사용합니다.
app.listen(port, () => {
  console.log(`서버가 ${port} 포트에서 실행 중입니다.`);
});
