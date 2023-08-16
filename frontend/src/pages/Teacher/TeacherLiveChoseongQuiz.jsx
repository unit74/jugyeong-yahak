import React, { useEffect, useState } from "react";
import styles from "./TeacherLiveReadWord.module.css";
import axios from "../Common/api/authAxios";

const BASE_URL = "https://i9e206.p.ssafy.io";

const TeacherLiveReadWord = (props) => {
  const [choseong, setChoseong] = useState(null);

  useEffect(() => {
    async function getChoseong() {
      await axios
        .get(`${BASE_URL}/api/v1/themes/choseong`)
        .then(function (response) {
          const data = response.data.data;

          setChoseong(data);
        })
        .catch(function (error) {
          console.error(error);
        });
    }

    getChoseong();
    return () => {
      setChoseong(null);
    };
  }, []);

  return (
    <div>
      <h1>초성 게임 진행 페이지</h1>
      <div>
        <div>오늘의 초성 : {choseong}</div>

        <button
          onClick={() => {
            props.$.sendSignalInfo({ choseong: choseong });
            props.$.sendSignalQuiz({ quiz: true });
          }}
        >
          퀴즈 시작
        </button>

        <button
          onClick={() => {
            props.$.sendSignalQuiz({ quiz: false });
          }}
        >
          (개발용) 걍 다음 잘했어요 페이지로
        </button>
        <button
          onClick={() => {
            props.$.setState({ timer: 0 }, () => {
              props.$.sendSignalQuiz({ quiz: false });
            });
          }}
        >
          (개발용) 걍 다음 아쉬워요 페이지로
        </button>
      </div>
    </div>
  );
};

export default TeacherLiveReadWord;
