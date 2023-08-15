// import axios from "../../Common/axios"; // 일단 axios도 만들어 둠
import axios from "axios";
import React from "react";
import { useEffect, useState, useCallback } from "react";
import StudentModal from "../components/Modal/StudentModal";
import { styled } from "styled-components";
import styles from "./index.css";
import AbsMember from "../components/AbsMember";
import { useNavigate } from "react-router-dom";

const StudyClassPage = () => {
  const [classes, setClasses] = useState([]); // 반은 여러개니까 배열로 받기위해서 State안에 [] 배열로 적어줌
  const [classSelected, setClassSelected] = useState(null);
  const [students, setStudents] = useState(null);
  const [modalOpen, setModalOpen] = useState(false); // 모달 오픈을 위해 열리기 전에는 false

  const navigate = useNavigate();

  const getClasses = async () => {
    await axios.get("https://i9e206.p.ssafy.io/api/v1/classes").then((response) => {
      console.log(response);
      setClasses(response.data.data);
    });
  };

  useEffect(() => {
    getClasses();
  }, []);

  const classClick = (studyclass) => {
    // studyclass state 넘겨줘야하니까 넣어주고
    // setAbsMemberLstOpen(true);
    setClassSelected(studyclass);
  };

  const getStudents = async (id) => {
    await axios
      .get(`https://i9e206.p.ssafy.io/api/v1/private/members/students/classes/${id}`)
      .then((response) => {
        console.log(response);
        setStudents(response.data.data);
        showModal();
        setClassSelected(null);
      });
  };

  useEffect(() => {
    if (classSelected !== null) {
      getStudents(classSelected.id);
    }
  }, [classSelected]);

  // 모달창 노출
  const showModal = () => {
    setModalOpen(true);
  };

  const closeModal = () => {
    setStudents(null);
    setModalOpen(false);
  };

  return (
    <div>
      <button onClick={() => navigate("/governmentmain")}>뒤로가기</button>
      <div>
        {classes.map((clazz, index) => (
          // 클릭했을 때 handleClick이라는 함수를 불러오겠다.
          <div onClick={() => classClick(clazz)}>
            {clazz.id}
            {clazz.className}
            {clazz.lectureTime}
          </div>
        ))}
      </div>

      {modalOpen && (
        <div className={styles.container} style={{ backgroundcolor: "red" }}>
          <button className={styles.close} onClick={closeModal}>
            X
          </button>
          {students.map((student, index) => (
            // 클릭했을 때 handleClick이라는 함수를 불러오겠다.
            <div>
              <div>{student.name}</div>
              <div>{student.address}</div>
              <img src={student.faceImageUrl}></img>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default StudyClassPage;
