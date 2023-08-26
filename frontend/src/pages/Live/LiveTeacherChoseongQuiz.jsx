import React, { useEffect, useState, useContext } from "react";
import axios from "../Common/api/authAxios";
import { OpenViduSessionContext } from "../Teacher/TeacherLive";
import { useOutletContext } from "react-router-dom";

const BASE_HTTP_URL = process.env.REACT_APP_BASE_HTTP_URL;

const LiveChoseongQuiz = () => {
  const sendSignal = useContext(OpenViduSessionContext);
  const choseong = useOutletContext().choseong;
  const timer = useOutletContext().timer;

  useEffect(() => {
    async function getChoseong() {
      await axios
        .get(`${BASE_HTTP_URL}/themes/choseong`)
        .then(function (response) {
          const data = response.data.data;

          sendSignal({ choseong: data }, "choseong");
        })
        .catch(function (error) {
          console.error(error);
        });
    }

    getChoseong();
    return () => {};
  }, []);

  return (
    <div>
      <h1>초성 퀴즈</h1>
      {timer > 0 && <div>{timer}</div>}
      <div>
        <div>오늘의 초성 : {choseong}</div>
        <div>초성을 보고 초성에 맞는 단어를 맞혀봅시다.</div>
      </div>
    </div>
  );
};

export default LiveChoseongQuiz;
