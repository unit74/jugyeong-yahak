import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import TeacherHeader from "./TeacherHeader";
import axios from "../Common/api/authAxios";
import styles from "./TeacherClass.module.css";
import { setLiveClass } from "../../store/actions/setLiveClassAction";
import { useDispatch } from "react-redux";

const BASE_URL = "https://i9e206.p.ssafy.io";

const TeacherClass = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [classes, setClasses] = useState([]);
  const [headerOpen, setHeaderOpen] = useState(true);

  const toggleHeader = () => {
    setHeaderOpen((prev) => !prev);
  };

  useEffect(() => {
    async function getClasses() {
      try {
        const response = await axios.get(
          `${BASE_URL}/api/v1/classes/unassigned`
        );
        const data = response.data.data;
        setClasses(data);
      } catch (error) {
        console.error(error);
      }
    }

    getClasses();

    return () => {};
  }, []);

  const handleClickClass = (clazz) => {
    alert(clazz.className + "의 실시간 강의를 열겠습니다.");

    dispatch(setLiveClass(clazz));
    navigate("/teacher-live");
  };

  return (
    <div className={styles.total}>
      <div
        className={`${styles.back} ${
          headerOpen ? styles.headerOpen : styles.headerClose
        }`} // open/close 상태에 따라서 클래스를 적용하여 CSS 처리함
      >
        <TeacherHeader
          toggleHeader={toggleHeader} // 사이드바 상태 업데이트 함수 전달
          headerOpen={headerOpen} // 사이드바 상태 전달
        />
        <div className={styles.main}>
          <b className={styles.bb}>✔ 수업하실 반을 선택해주세요</b>
          <div className={styles.classesContainer}>
            {classes.map((clazz, i) => (
              <button
                key={i}
                className={styles.btn}
                onClick={() => handleClickClass(clazz)}
              >
                {clazz.className}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
export default TeacherClass;
