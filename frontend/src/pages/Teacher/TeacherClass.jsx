import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import axios from "../Common/api/authAxios";

const BASE_URL = "https://i9e206.p.ssafy.io";

const TeacherClass = () => {
  const navigate = useNavigate();
  const [classes, setClasses] = useState([]);

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
    <div>
      {classes.map((clazz, i) => {
        return (
          <p key={i}>
            <button onClick={() => handleClickClass(clazz)}>
              {clazz.className}의 라이브 강의 열기
            </button>
          </p>
        );
      })}
    </div>
  );
};

export default TeacherClass;
