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

  return (
    <div className={styles.ipadPro1115}>
      <main className={styles.main}>
        <div>
          <div className={styles.curriculumBtnContainer}>
            {curriculums.map((curriculum, i) => (
              <div
                className={styles.curriculumBtnEach}
                key={i}
                onClick={() => {
                  props.$.setState(
                    {
                      page: props.$.state.page + 1,
                      theme: props.$.state.theme,
                      curriculum: curriculum,
                    },
                    () => {
                      const data = {
                        page: props.$.state.page,
                        theme: props.$.state.theme,
                        curriculum: props.$.state.curriculum,
                      };

                      props.$.sendSignalInfo(data);
                    }
                  );
                }}
              >
                <img
                  src={curriculum.curriculumImage}
                  alt=""
                  height="100"
                  width="100"
                />
                <button
                  className={`${styles.curriculumBtn} ${
                    styles[`curriculum-${i + 1}`]
                  }`}
                >
                  {curriculum.curriculumName}
                </button>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default TeacherCurriculum;
