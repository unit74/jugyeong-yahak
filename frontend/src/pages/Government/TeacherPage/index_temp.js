// import axios from "../../Common/axios"; // 일단 axios도 만들어 둠
import axios from "axios";
import React from "react";
import { useEffect, useState, useCallback } from "react";
import StudentModal from "../components/Modal/StudentModal";
import { styled } from "styled-components";
import styles from "./gov_teacher.module.css";
import AbsMember from "../components/AbsMember";
import { useNavigate } from "react-router-dom";

const StudyClassPage = () => {
  const [students, setStudents] = useState(null);
  const [studentSelected, setstudentSelected] = useState(null);
  const [modalOpen, setModalOpen] = useState(false); // 모달 오픈을 위해 열리기 전에는 false

  const navigate = useNavigate();

  const getStudents = async (id) => {
    await axios
      .get(`https://i9e206.p.ssafy.io/api/v1/private/members/teachers`)
      .then((response) => {
        setStudents(response.data.data);
      });
  };

  useEffect(() => {
    getStudents();
  }, []);

  useEffect(() => {
    if (studentSelected !== null) {
      //   getStudent(classSelected.id);
    }
  }, [studentSelected]);

  const studentClick = (student) => {
    setstudentSelected(student);
    showModal();
  };

  // 모달창 노출
  const showModal = () => {
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
  };

  return (
    <div>
      <button onClick={() => navigate("/governmentmain")}>뒤로가기</button>
      <div>
        {students &&
          students.map((student, index) => (
            // 클릭했을 때 handleClick이라는 함수를 불러오겠다.
            <div onClick={() => studentClick(student)}>
              {student.id}
              {student.phone}
              {student.address}
            </div>
          ))}
      </div>

      {modalOpen && studentSelected && (
        <div className={styles.container} style={{ backgroundcolor: "red" }}>
          <button className={styles.close} onClick={closeModal}>
            X
          </button>
          <div>
            <div>{studentSelected.name}</div>
            <div>{studentSelected.address}</div>
            <img src={studentSelected.faceImageUrl}></img>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudyClassPage;
