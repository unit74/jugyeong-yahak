import React, { useEffect, useState } from "react";
import styles from "./TeacherTheme.module.css";
import TeacherHeader from "./TeacherHeader";
import axios from "../Common/api/authAxios";

const BASE_URL = "https://i9e206.p.ssafy.io";

const TeacherTheme = (props) => {
  const [themes, setThemes] = useState([]);

  useEffect(() => {
    async function getThemes() {
      await axios
        .get(`${BASE_URL}/api/v1/themes`)
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
    <div className={styles.ipadPro1115}>
      <TeacherHeader />
      <main className={styles.main}>
        <div>
          <span>오늘의 </span>
          <span className={styles.topic}>주제</span>
          <span>를 선택해주세요</span>
        </div>
      </main>
      <div id="themes">
        {themes.map((theme, i) => {
          <div id="theme">
            <button
              onClick={() => {
                props.$.setState({
                  theme: theme.themeName,
                });
              }}
            >
              {theme.themeName}
            </button>
          </div>;
        })}
      </div>
    </div>
  );
};

export default TeacherTheme;
