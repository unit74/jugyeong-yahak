// import axios from "../../Common/axios"; // 일단 axios도 만들어 둠
import axios from "axios";
import React from "react";
import { useEffect, useState, useCallback } from "react";
import StudentModal from "../components/Modal/StudentModal";
import styles from "./gov_class.module.css";
import AbsMember from "../components/AbsMember";
import { useNavigate } from "react-router-dom";

const PER_PAGE = 1; // 한 페이지당 보여줄 학생 수 

const StudyClassPage = () => {
  const [classes, setClasses] = useState([]); // 반은 여러개니까 배열로 받기위해서 State안에 [] 배열로 적어줌
  const [classSelected, setClassSelected] = useState(null);
  const [students, setStudents] = useState(null);
  const [modalOpen, setModalOpen] = useState(false); // 모달 오픈을 위해 열리기 전에는 false
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  useEffect(() => {
    if (students) {
      setTotalPages(Math.ceil(students.length / PER_PAGE));
    }
  }, [students]);

  const nextPage = () => {
    setCurrentPage(currentPage + 1 >= totalPages ? totalPages - 1 : currentPage + 1);
  };

  const prevPage = () => {
    setCurrentPage(currentPage - 1 < 0 ? 0 : currentPage - 1);
  };

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
    <div className={styles.main}>
      <div className={styles.back}>
        <b className={styles.bb}>✔ 확인하실 교실을 선택해주세요</b>
        <button className={styles.goback} onClick={() => navigate("/governmentmain")}>↩</button>
        <div className={styles.options}>

          <table>
            <thead>
              <tr>
                <th>반 번호</th>
                <th>반 이름</th>
                <th>수업 시간</th>
              </tr>
            </thead>
            <tbody>
              {classes.map((clazz, index) => (
                // 클릭했을 때 classClick이라는 함수를 불러오겠다.
                <tr onClick={() => classClick(clazz)}>
                  <td>{clazz.id}</td>
                  <td>{clazz.className}</td>
                  <td>{clazz.lectureTime}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {modalOpen && students && (
          <div className={`${styles.modal} ${styles.container}`}>
            <button className={styles.close} onClick={closeModal}>
              X
            </button>
            {students.slice(currentPage * PER_PAGE, (currentPage + 1) * PER_PAGE).map((student, index) => (
              <div className={styles.studentInfo}>
                <img className={styles.studentImage} src={student.faceImageUrl}></img>
                <div className={styles.textContainer}>
                  <div className={`${styles.modalText}`}>이름: {student.name}</div>
                  <div className={`${styles.modalText}`}>주소: {student.address}</div>
                  <div className={`${styles.modalText}`}>전화번호: {student.phone}</div>
                </div>
              </div>
            ))}
            <div className={styles.modalNav}>
              <button className={styles.prevButton} onClick={prevPage}>
                ◁
              </button>
              <button className={styles.nextButton} onClick={nextPage}>
                ▷
              </button> </div>
          </div>
        )}

      </div> </div>
  );
};

export default StudyClassPage;
