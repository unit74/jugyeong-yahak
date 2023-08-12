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
    <div className={styles.themeBtnContainer}>
      {themes.map((theme, i) => (
        <button
          key={theme.themeName}
          className={`${styles.themeBtn} ${styles[`theme-${i + 1}`]}`}
          onClick={() => {
            props.$.setState({
              theme: theme.themeName,
            });
          }}
        >
          {theme.themeName}
        </button>
      ))}
    </div>
  );
};

export default TeacherTheme;
