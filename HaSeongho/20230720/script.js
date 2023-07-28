const imageUpload = document.getElementById('imageUpload')

Promise.all([
    faceapi.nets.faceRecognitionNet.loadFromUri('./models'),
    faceapi.nets.faceLandmark68Net.loadFromUri('./models'),
    faceapi.nets.ssdMobilenetv1.loadFromUri('./models')
]).then(start)

async function start() {

    // Canvas container 생성
    const container = document.createElement('div')
    container.style.position = 'relative'
    document.body.append(container)

    // 얼굴과 라벨을 매칭한다.
    const labeledFaceDescriptors = await loadLabeledImage()
    const faceMatcher = new faceapi.FaceMatcher(labeledFaceDescriptors, 0.6)

    document.body.append('loaded')

    imageUpload.addEventListener('change', async () => {

        // 사진을 화면에 표시함
        const image = await faceapi.bufferToImage(imageUpload.files[0])
        container.append(image)

        // canvas를 초기화 한다
        const canvas = faceapi.createCanvasFromMedia(image)
        container.append(canvas)
        const displaySize = {width: image.width, height: image.height}
        faceapi.matchDimensions(canvas, displaySize)

        // 사진에서 얼굴을 식별한다.
        const detections = await faceapi.detectAllFaces(image)
                                .withFaceLandmarks()
                                .withFaceDescriptors()
        
        // 사진에서 얼굴 좌표에 box를 그린다.
        const resizedDetections = faceapi.resizeResults(detections, displaySize)

        // 얼굴에 라벨을 표시한다.
        const result = resizedDetections.map(d => faceMatcher.findBestMatch(d.descriptor))
        result.forEach((result, i) => {
            const box = resizedDetections[i].detection.box
            const drawBox = new faceapi.draw.DrawBox(box, {label: result.toString()})
            drawBox.draw(canvas)
            //alert(result.toString())
        })
    })
}

// 얼굴 기초데이터를 초기화 한다.
function loadLabeledImage() {
    const labels = [ 'lee']
    return Promise.all(
        labels.map(async label => {
            const description = []
            //https://s3.ap-northeast-2.amazonaws.com/s3-hotsix/lee.png
            const img = await faceapi.fetchImage('https://s3.ap-northeast-2.amazonaws.com/s3-hotsix/' + label + '.png')
            const detections = await faceapi.detectSingleFace(img)
                                .withFaceLandmarks()
                                .withFaceDescriptor()
            description.push(detections.descriptor)
            return new faceapi.LabeledFaceDescriptors(label, description)
        })
    )
}