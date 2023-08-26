import React, { useEffect, useState, useContext } from "react";
import styles from "./LiveCurriculum.module.css";
import axios from "../Common/api/authAxios";
import { OpenViduSessionContext } from "../Teacher/TeacherLive";
import { useOutletContext } from "react-router-dom";

const BASE_HTTP_URL = process.env.REACT_APP_BASE_HTTP_URL;

const LiveCurriculum = () => {
  const sendSignal = useContext(OpenViduSessionContext);
  const theme = useOutletContext().theme;
  const [curriculums, setCurriculums] = useState([]);

  const send = (data, page) => {
    sendSignal(data, page);
  };

  useEffect(() => {
    async function getCurriculums() {
      await axios
        .get(`${BASE_HTTP_URL}/themes/stages/${theme}`)
        .then(function (response) {
          const data = response.data.data;

          if (data.length === 0) {
            alert("모두 완료된 테마입니다.");
            send({ theme: null }, "theme");
            send({ page: "theme" }, "page");
          } else setCurriculums(data);
        })
        .catch(function (error) {
          console.error(error);
        });
    }

    getCurriculums();
    return () => {
      setCurriculums([]);
    };
  }, []);

  const chooseCurriculum = async (curriculum) => {
    console.log(curriculum);
    await axios
      .get(`${BASE_HTTP_URL}/themes/${curriculum.curriculumnId}`)
      .then(function (response) {
        const data = response.data.data;

        send({ curriculum: data }, "curriculum");
        send({ page: "journal" }, "page");
      })
      .catch(function (error) {
        console.error(error);
      });
  };

  return (
    <div className={styles.main}>
      <div>
        <div className={styles.curriculumBtnContainer}>
          {curriculums.map((curriculum, i) => (
            <div
              className={styles.curriculumBtnEach}
              key={i}
              onClick={() => {
                if (window.confirm("강의를 시작하시겠습니까?")) chooseCurriculum(curriculum);
              }}
            >
              <img src={curriculum.curriculumImage} alt="" height="100" width="100" />
              <button className={`${styles.curriculumBtn} ${styles[`curriculum-${i + 1}`]}`}>
                {curriculum.curriculumName}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LiveCurriculum;
