//https://s3.ap-northeast-2.amazonaws.com/s3-hotsix/lee.png

//const imageUpload = document.getElementById('imageUpload')

const faceapi = require('face-api.js');
const { createCanvas, loadImage } = require('canvas');
const fs = require('fs');

async function run() {
  // 모델 로드
  await faceapi.nets.ssdMobilenetv1.loadFromDisk('./models');
  await faceapi.nets.faceLandmark68Net.loadFromDisk('./models');
  await faceapi.nets.faceRecognitionNet.loadFromDisk('./models');

  // 이미지 로드
  const image = await loadImage('./images/lee3.jpg');
  const canvas = createCanvas(image.width, image.height);
  const ctx = canvas.getContext('2d');
  ctx.drawImage(image, 0, 0);

  const labeledFaceDescriptors = await loadLabeledImage();
  const faceMatcher = new faceapi.FaceMatcher(labeledFaceDescriptors, 0.6);

  // 얼굴 인식
  const detections = await faceapi.detectAllFaces(canvas)
    .withFaceLandmarks()
    .withFaceDescriptors();

  // 얼굴을 매칭합니다.
  const result = detections.map(d => faceMatcher.findBestMatch(d.descriptor));

  // 일치하는 정보를 리턴합니다.
  console.log(result);
}

function loadLabeledImage() {
  const labels = ['lee'];
  return Promise.all(
    labels.map(async label => {
      const description = [];
      const img = await loadImage('https://s3.ap-northeast-2.amazonaws.com/s3-hotsix/'+label+'.png');

      const detections = await faceapi.detectSingleFace(img)
        .withFaceLandmarks()
        .withFaceDescriptor();
      description.push(detections.descriptor);
      return new faceapi.LabeledFaceDescriptors(label, description);
    })
  );
}

run();