import React, { useEffect, useState } from "react";
import styles from "./TeacherCurriculum.module.css";
import TeacherHeader from "./TeacherHeader";
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

          setCurriculums(data);
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
      .get(`${BASE_URL}/api/v1/themes/${curriculum.curriculumnId}`)
      .then(function (response) {
        const data = response.data.data;

        props.$.setState(
          {
            page: props.$.state.page + 1,
            theme: props.$.state.theme,
            curriculum: data,
          },
          () => {
            const sendData = {
              page: props.$.state.page,
              theme: props.$.state.theme,
              curriculum: props.$.state.curriculum.situation,
            };

            props.$.sendSignalInfo(sendData);
          }
        );
      })
      .catch(function (error) {
        console.error(error);
      });
  };

  return (
    <div className={styles.ipadPro1115}>
      <TeacherHeader />
      <main className={styles.main}>
        <div>
          <span>오늘의 </span>
          <span className={styles.topic}>커리큘럼</span>
          <span>을 선택해주세요</span>
          <div id="curriculums">
            {curriculums.map((curriculum, i) => (
              <div id="curriculum" key={i} onClick={() => chooseCurriculum(curriculum)}>
                <img src={curriculum.curriculumImage} alt="" height="100" width="100" />
                <button>{curriculum.curriculumName}</button>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default TeacherCurriculum;
