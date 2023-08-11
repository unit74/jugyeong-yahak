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

  const Button = styled.button`
    background-color: #2890f9;
    color: white;
    border: none;
    padding: 10px 20px;
    border-radius: 5px;
    cursor: pointer;
    text-transform: uppercase;
    font-weight: bold;
    &:hover {
      background-color: #357ae8;
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
        .get(`${BASE_URL}/api/v1/classes`)
        .then(function (response) {
          console.log(response);
          const data = response.data.data;
          console.log(`${localStorage.getItem("accessToken")}`);
          console.log(data);
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
          <b className={styles.bb}>수업하실 반을 선택해주세요</b>
          {classes.map((clazz, i) => {
            return (
              <p key={i}>
                <Button
                  className={styles.btn}
                  onClick={() => handleClickClass(clazz)}
                >
                  {clazz.className}
                </Button>
              </p>
            );
          })}
        </Main>
      </div>
    </div>
  );
};

export default TeacherClass;
