import React, { useEffect, useState } from "react";
import styles from "./TeacherCurriculum.module.css";
import axios from "../Common/api/authAxios";

const BASE_URL = "https://i9e206.p.ssafy.io";

const TeacherCurriculum = (props) => {
  const [curriculums, setCurriculums] = useState([]);

  useEffect(() => {
    async function getCurriculums() {
      await axios
        .get(`${BASE_URL}/api/v1/themes/stages/${props.$.state.theme}`)
        .then(function (response) {
          const data = response.data.data;

          if (data.length === 0) {
            alert("모두 완료된 테마입니다.");
            props.$.setState({
              theme: null,
            });
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
  }, [props.$]);

  const chooseCurriculum = async (curriculum) => {
    console.log(curriculum);
    await axios
      .get(`${BASE_URL}/api/v1/themes/${curriculum.curriculumnId}`)
      .then(function (response) {
        const data = response.data.data;

        const sendData = {
          page: 1,
          theme: props.$.state.theme,
          curriculum: data,
        };

        props.$.sendSignalInfo(sendData);
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
              onClick={() => chooseCurriculum(curriculum)}
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

export default TeacherCurriculum;
