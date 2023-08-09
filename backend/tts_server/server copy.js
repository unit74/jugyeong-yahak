const express = require("express");
const cors = require("cors");
const path = require("path");
const mediaRouter = require("./mediaRouter.js");

const app = express();
const bodyParser = require("body-parser");

app.use(
  cors({
    origin: "*", // 모든 출처 허용 옵션. true 를 써도 된다.
  })
);
app.use("/media", mediaRouter);
app.use(bodyParser.json());

const client_id = "vrwxvtxait";
const client_secret = "koDQjISgnhMa33W2QFE58k8kxt4wkunZ455bI6QL";

const fs = require("fs");

app.post("/getVoice", async (req, res) => {
  console.log("getVoice");

  const { userName, inputValue } = req.body;

  var api_url = "https://naveropenapi.apigw.ntruss.com/tts-premium/v1/tts";
  var request = require("request");
  var options = {
    url: api_url,
    form: {
      speaker: "nara",
      volume: "0",
      speed: "0",
      pitch: "0",
      text: inputValue,
      format: "mp3",
    },
    headers: { "X-NCP-APIGW-API-KEY-ID": client_id, "X-NCP-APIGW-API-KEY": client_secret },
  };

  var writeStream = fs.createWriteStream(`./tts${userName}.mp3`);

  var _req = request.post(options).on("response", function (response) {
    console.log(response.statusCode); // 200
    console.log(response.headers["content-type"]);
  });
  _req.pipe(writeStream); // file로 출력

  // let filePath = path.join(__dirname, "tts1.mp3");
  // res.sendFile(filePath);

  // var filePath = `tts${userName}.mp3`;
  // var stat = fs.statSync(filePath);

  // console.log(stat.size);

  // res.writeHead(200, {
  //   "Content-Type": "audio/mpeg",
  //   "Content-Length": stat.size,
  // });

  // var readStream = fs.createReadStream(filePath);
  // readStream.pipe(res);

  res.json(_req);
});

// 3. listen 함수로 8080 포트를 가진 서버를 실행한다. 서버가 실행된 것을 콘솔창에서 확인하기 위해 'Server is running...' 로그를 출력한다
app.listen(2000, () => {
  console.log("Server is running... on Port 3000");
});
