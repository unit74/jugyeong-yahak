const express = require("express");
const fs = require("fs");
const cors = require("cors");
const request = require("request");
require("dotenv").config();

const app = express();

app.use(express.json());

app.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`);
  next();
});

app.use(
  cors({
    origin: "*", // 모든 출처 허용 옵션.
  })
);

// 환경 변수에서 정보를 불러옵니다.
const client_id = process.env.CLIENT_ID;
const client_secret = process.env.CLIENT_SECRET;

function handleTTSRequest(req, res) {
  console.log("Received request on /tts");

  const { text } = req.body || req.query; // <-- '클라이언트로부터 텍스트를 받아옵니다.'

  const api_url = process.env.NAVER_API_URL;
  const options = {
    url: api_url,
    form: { speaker: "nyejin", volume: "-5", speed: "0", pitch: "0", text: text, format: "mp3" },
    headers: { "X-NCP-APIGW-API-KEY-ID": client_id, "X-NCP-APIGW-API-KEY": client_secret },
  };

  // const writeStream = fs.createWriteStream('./tts1.mp3');
  const _req = request
    .post(options)
    .on("response", function (response) {
      console.log("Received response from Naver API:", response.statusCode);
      console.log("Response content-type:", response.headers["content-type"]);
    })
    .on("error", function (err) {
      console.error("API request error: ", err);
      res.status(500).send("Failed to fetch from Naver API.");
    });

  // writeStream.on('finish', function() {
  //   console.log('File write completed.');
  // }).on('error', function(err) {
  //   console.error('Error while writing file:', err);
  // });

  _req.pipe(res); // 브라우저로 출력
}

app.get("/tts", handleTTSRequest);
app.post("/tts", handleTTSRequest);

app.listen(3000, function () {
  console.log("http://127.0.0.1:3000/tts app listening on port 3000!");
});
