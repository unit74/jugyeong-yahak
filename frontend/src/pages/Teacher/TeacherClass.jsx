import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import TeacherHeader from "./TeacherHeader";
import axios from "../Common/api/authAxios";
import styles from "./TeacherClass.module.css";
import styled from "@emotion/styled";

const BASE_URL = "https://i9e206.p.ssafy.io";

const TeacherClass = () => {
  const navigate = useNavigate();
  const [classes, setClasses] = useState([]);

  const Main = styled.div`
    padding: 5%;
  `;

  const buttonColors = [
    "#ffa742",
    "#51ee56",
    "#ff9a9a",
    "#8f70ff",
    "#fa67ff",
    "#ff5d73",
    "#5da3ff",
  ];

  const Button = styled.button`
    background-color: ${({ colorIndex }) =>
      buttonColors[colorIndex % buttonColors.length]};
    color: white;
    border: none;
    padding: 10px 20px;
    border-radius: 5px;
    cursor: pointer;
    text-transform: uppercase;
    font-weight: bold;
    &:hover {
      background-color: hsl(145, 100%, 51%);
    }
  `;
  const Background = styled.div`
    width: 100%;
    min-height: 100vh;
    background-image: url("../../assets/images/teacherback.jpg");
    background-size: cover;
    background-repeat: no-repeat;
    background-position: center center;
  `;

  useEffect(() => {
    async function getClasses() {
      await axios
        .get(`${BASE_URL}/api/v1/classes/unassigned`)
        .then(function (response) {
          const data = response.data.data;

          setClasses(data);
        })
        .catch(function (error) {
          console.error(error);
        });
    }

    getClasses();

    return () => {};
  }, []);

  const handleClickClass = (clazz) => {
    alert(clazz.className + "의 실시간 강의를 열겠습니다.");
    navigate("/teacher-live", { state: { clazz: clazz } });
  };

  return (
    <div className={styles.total}>
      <TeacherHeader />
      <div className={styles.back}>
        <Main>
          <b className={styles.bb}>✔ 수업하실 반을 선택해주세요</b>
          <div className={styles.classesContainer}>
            {classes.map((clazz, i) => (
              <Button
                key={i}
                colorIndex={i}
                className={styles.btn}
                onClick={() => handleClickClass(clazz)}
              >
                {clazz.className}
              </Button>
            ))}
          </div>
        </Main>
      </div>
    </div>
  );
};

export default TeacherClass;
