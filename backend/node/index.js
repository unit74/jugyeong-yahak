const express = require("express");
const faceapi = require('face-api.js');
const { Canvas, Image } = require("canvas");
const canvas = require("canvas");
const fileUpload = require("express-fileupload");

faceapi.env.monkeyPatch({ Canvas, Image }); //node에서 canvas 사용 가능

const app = express();

app.use( //req에서 file 찾기 위해 설정
    fileUpload({
      useTempFiles: true,
    })
);

async function LoadModels() { // 모델 로드 -> 최초 한번만 되도록 faceapi가 관리

  await faceapi.nets.ssdMobilenetv1.loadFromDisk('./models');
  await faceapi.nets.faceLandmark68Net.loadFromDisk('./models');
  await faceapi.nets.faceRecognitionNet.loadFromDisk('./models');

}
LoadModels();


async function getDescriptorsFromDB(tempImage, labels) {

    const image = await canvas.loadImage(tempImage);

     // DB 얼굴과 라벨을 매칭합니다.
    const labeledFaceDescriptors = await loadLabeledImage(labels);
    const faceMatcher = new faceapi.FaceMatcher(labeledFaceDescriptors, 0.6);

    // 사진에서 얼굴을 식별합니다.
    const detections = await faceapi.detectAllFaces(image)
                        .withFaceLandmarks()
                        .withFaceDescriptors();

    return detections.map(d => faceMatcher.findBestMatch(d.descriptor));

}

app.post("/check-face", async (req, res) => {

    //req에 Face라는 Key로 파일을 보낼 것임
    let image = req.files.Face.tempFilePath;
    const labels = ['lee'];

    let result = await getDescriptorsFromDB(image, labels);
    
    res.json({result});
});

function loadLabeledImage(labels) {
  
  return Promise.all(
    labels.map(async label => {
      const description = [];
      
      const img = await canvas.loadImage("https://s3.ap-northeast-2.amazonaws.com/s3-hotsix/"+label+".png");
      const detections = await faceapi.detectSingleFace(img)
        .withFaceLandmarks()
        .withFaceDescriptor();
      description.push(detections.descriptor);
      
      console.log("loadLabel 끝")

      return new faceapi.LabeledFaceDescriptors(label, description);
    })
  );
}

const port = process.env.PORT || 3000; // 환경 변수에서 포트를 가져오거나 기본값으로 3000을 사용합니다.
app.listen(port, () => {
  console.log(`서버가 ${port} 포트에서 실행 중입니다.`);
});