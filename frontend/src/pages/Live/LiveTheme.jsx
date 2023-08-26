import React, { useEffect, useState, useContext } from "react";
import styles from "./LiveTheme.module.css";
import axios from "../Common/api/authAxios";
import { OpenViduSessionContext } from "../Teacher/TeacherLive";

const BASE_HTTP_URL = process.env.REACT_APP_BASE_HTTP_URL;

const LiveTheme = () => {
  const sendSignal = useContext(OpenViduSessionContext);
  const [themes, setThemes] = useState([]);

  const send = (data, page) => {
    sendSignal(data, page);
  };

  useEffect(() => {
    async function getThemes() {
      await axios
        .get(`${BASE_HTTP_URL}/themes`)
        .then(function (response) {
          const data = response.data.data;

          setThemes(data);
        })
        .catch(function (error) {
          console.error(error);
        });
    }

    getThemes();
    return () => {
      setThemes([]);
    };
  }, []);

  return (
    <div>
      <h1>✔ 수업하실 테마를 선택해주세요</h1>
      <div className={styles.themeBtnContainer}>
        {themes.map((theme, i) => (
          <button
            key={i}
            className={`${styles.themeBtn} ${styles[`theme-${i + 1}`]}`}
            onClick={() => {
              send({ theme: theme.themeName }, "theme");
              send({ page: "curriculum" }, "page");
            }}
          >
            {theme.themeName}
          </button>
        ))}
      </div>
    </div>
  );
};

export default LiveTheme;
