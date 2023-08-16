import React, { useState } from "react";
import { EventSourcePolyfill } from "event-source-polyfill";
import { useNavigate } from "react-router-dom";
import axios from "axios";

//단어읽기 문제 표시 페이지
export default function SSETest() {
  const navigate = useNavigate();

  const BASE_URL_SSE = "https://i9e206.p.ssafy.io/sse/v1";

  const handleConnect = () => {
    const eventSourceInitDict = {
      heartbeatTimeout: 60000 * 60, // 타임아웃을 60분으로 설정
    };

    const sse = new EventSourcePolyfill(
      `${BASE_URL_SSE}/subscribe?streamId=${26}&classId=${5}`,
      eventSourceInitDict
    );

    sse.addEventListener("connect", (e) => {
      // connect라는 이벤트를 받았을 때, connect data 출력
      const { data: receivedConnectData } = e;

      console.log("Connected! ", receivedConnectData);
    });

    sse.addEventListener("page", () => {
      console.log("navigate");
      //   navigate("/student-live");
    });

    alert(`Connected`);
  };

  const pageEvent = async () => {
    await axios.post(`${BASE_URL_SSE}/convert/page`, {
      classId: 5,
      streamId: 26,
      number: 0,
    });
  };

  return (
    <div className="App">
      <header className="App-header">
        <button onClick={() => handleConnect()}>Connect ! ! ! !</button>
        <button onClick={() => pageEvent()}>navigate</button>
      </header>
    </div>
  );
}
