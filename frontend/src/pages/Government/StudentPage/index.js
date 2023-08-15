// import axios from "../../Common/axios"; // 일단 axios도 만들어 둠
import axios from "axios";
import React from "react";
import { useEffect, useState, useCallback } from "react";
import StudentModal from "../components/Modal/StudentModal";
import styles from "./gov_student.module.css";

import AbsMember from "../components/AbsMember";
import { useNavigate } from "react-router-dom";

const StudyClassPage = () => {
  const [students, setStudents] = useState(null);
  const [studentSelected, setstudentSelected] = useState(null);
  const [modalOpen, setModalOpen] = useState(false); // 모달 오픈을 위해 열리기 전에는 false

  const navigate = useNavigate();

  const getStudents = async (id) => {
    await axios
      .get(`https://i9e206.p.ssafy.io/api/v1/private/members/students`)
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
    <div className={styles.main}>
      <div className={styles.back}>
        <b className={styles.bb}>✔ 확인하실 학생을 선택해주세요</b>
        <button className={styles.goback} onClick={() => navigate("/governmentmain")}>↩</button>
        <div className={styles.options}>
          {students && (
            <table>
              <thead>
                <tr>
                  <th>이름</th>
                  <th>아이디</th>
                  <th>전화번호</th>
                  <th>주소</th>
                </tr>
              </thead>
              <tbody>
                {students.map((student, index) => (
                  // 클릭했을 때 handleClick이라는 함수를 불러오겠다.
                  <tr onClick={() => studentClick(student)} key={index}>
                    <td>{student.name}</td>
                    <td>{student.id}</td>
                    <td>{student.phone}</td>
                    <td>{student.address}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>


        {modalOpen && studentSelected && (
          <div className={`${styles.modal} ${styles.container}`} style={{ backgroundcolor: "red" }}>
            <button className={styles.close} onClick={closeModal}>
              X
            </button>
            <div className={styles.studentInfo}>
              <img className={styles.studentImage} src={studentSelected.faceImageUrl}></img>
              <div className={styles.textContainer}>
                <div className={`${styles.modalText}`}>이름: {studentSelected.name}</div>
                <div className={`${styles.modalText}`}>주소: {studentSelected.address}</div>
                <div className={`${styles.modalText}`}>전화번호: {studentSelected.phone}</div>
              </div>
            </div>
          </div>
        )}

      </div></div>
  );
};

export default StudyClassPage;
