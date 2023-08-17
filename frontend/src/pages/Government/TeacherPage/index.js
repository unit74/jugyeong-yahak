// import axios from "../../Common/axios"; // 일단 axios도 만들어 둠
import axios from "axios";
import React from "react";
import { useEffect, useState, useCallback } from "react";
// import TeacherModal from "../components/Modal/TeacherModal";
import styles from "./gov_teacher.module.css";

import AbsMember from "../components/AbsMember";
import { useNavigate } from "react-router-dom";

const StudyClassPage = () => {
  const [teachers, setTeachers] = useState(null);
  const [modalOpen, setModalOpen] = useState(false); // 모달 오픈을 위해 열리기 전에는 false
  const [modify, setModify] = useState(false);
  const [selectedTeacher, setSelectedTeacher] = useState(null);
  const [address, setAddress] = useState(null);
  const [classId, setClassId] = useState(null);
  const [firstResponder, setFirstResponder] = useState(null);
  const [id, setId] = useState(null);
  const [name, setName] = useState(null);
  const [phone, setPhone] = useState(null);
  const [statusCode, setStatusCode] = useState(null);
  const [tabletNo, setTabletNo] = useState(null);
  const [faceImageUrl, setFaceImageUrl] = useState(null);
  const [regist, setRegist] = useState(false);
  const [gender, setGender] = useState(false);
  const [img, setImg] = useState(null);

  const navigate = useNavigate();

  const getTeachers = async (id) => {
    await axios
      .get(`https://i9e206.p.ssafy.io/api/v1/private/members/teachers`)
      .then((response) => {
        setTeachers(response.data.data);
      });
  };

  useEffect(() => {
    getTeachers();
  }, []);

  const deleteTeacher = async () => {
    let code = "";

    if (statusCode == "A01") {
      code = "A02";
    } else {
      code = "A01";
    }
    await axios
      .put(`https://i9e206.p.ssafy.io/api/v1/private/members/teachers`, {
        address: address,
        classId: classId,
        firstResponder: firstResponder,
        id: id,
        name: name,
        phone: phone,
        statusCode: code,
        tabletNo: tabletNo,
      })
      .then(() => {
        closeModal();
        getTeachers();
      });
  };

  const cancelModify = () => {
    let student = selectedTeacher;
    setFaceImageUrl(student.faceImageUrl);
    setAddress(student.address);
    setClassId(student.classId);
    setFirstResponder(student.firstResponder);
    setId(student.id);
    setName(student.name);
    setPhone(student.phone);
    setStatusCode(student.statusCode);
    setTabletNo(student.tabletNo);
    setTabletNo(student.tabletNo);
    modifyChange();
  };

  const studentClick = (student) => {
    console.log(student);
    setSelectedTeacher(student);
    setFaceImageUrl(student.faceImageUrl);
    setAddress(student.address);
    setClassId(student.classId);
    setFirstResponder(student.firstResponder);
    setId(student.id);
    setName(student.name);
    setPhone(student.phone);
    setStatusCode(student.statusCode);
    setTabletNo(student.tabletNo);
    setTabletNo(student.tabletNo);

    showModal();
  };

  const applyModify = async () => {
    await axios
      .put(`https://i9e206.p.ssafy.io/api/v1/private/members/teachers`, {
        address: address,
        classId: classId,
        firstResponder: firstResponder,
        id: id,
        name: name,
        phone: phone,
        statusCode: statusCode,
        tabletNo: tabletNo,
      })
      .then(() => {
        modifyChange();
        closeModal();
        getTeachers();
      });
  };

  const applyRegist = async () => {
    const formData = new FormData();
    console.log(img);

    formData.append("faceImage", img);
    formData.append(
      "studentRegisterRequest",
      JSON.stringify({
        address: address,
        classId: classId,
        firstResponder: firstResponder,
        gender: gender,
        name: name,
        phone: phone,
        statusCode: statusCode,
        tabletNo: tabletNo,
      })
    );

    // formData.append(
    //   "studentRegisterRequest",
    //   new Blob(
    //     [
    //       JSON.stringify({
    //         address: address,
    //         classId: classId,
    //         firstResponder: firstResponder,
    //         gender: gender,
    //         name: name,
    //         phone: phone,
    //         statusCode: statusCode,
    //         tabletNo: tabletNo,
    //       }),
    //     ],
    //     {
    //       type: "application/json",
    //     }
    //   )
    // );

    await axios
      .post(`https://i9e206.p.ssafy.io/api/v1/private/members/teachers`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      })
      .then(() => {
        modifyChange();
        setRegist(false);
        closeModal();
        getTeachers();
      });
  };

  const registTeacher = () => {
    setFaceImageUrl(null);
    setAddress("");
    setClassId("");
    setFirstResponder("");
    setId("");
    setName("");
    setPhone("");
    setStatusCode("");
    setTabletNo("");
    setGender("");
    setImg("");
    showModal();
    setModify(true);
    setRegist(true);
  };

  // 모달창 노출
  const showModal = () => {
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setRegist(false);
  };

  const modifyChange = () => {
    setModify(!modify);
  };

  return (
    <div className={styles.main}>
      <div className={styles.back}>
        <b className={styles.bb}>✔ 확인하실 선생님을 선택해주세요</b>
        <button className={styles.goback} onClick={() => navigate("/governmentmain")}>
          ↩
        </button>
        <button className={styles.register} onClick={() => registTeacher()}>
          선생님 등록
        </button>
        <div className={styles.options}>
          {teachers && (
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
                {teachers.map((student, index) => (
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

        {modalOpen && (
          <div className={`${styles.modal} ${styles.container}`} style={{ backgroundcolor: "red" }}>
            <button className={styles.close} onClick={closeModal}>
              X
            </button>
            <div className={styles.studentInfo}>
              {!regist && <img className={styles.studentImage} src={faceImageUrl}></img>}
              <div className={styles.textContainer}>
                <div className={`${styles.modalText}`}>
                  <label htmlFor="name">이름: </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    className={styles.custom_input}
                    value={name}
                    onChange={(event) => setName(event.target.value)}
                    readOnly={!modify}
                  />
                </div>
                <div className={`${styles.modalText}`}>
                  <label htmlFor="address">주소: </label>
                  <input
                    type="text"
                    id="address"
                    className={styles.custom_input}
                    name="address"
                    value={address}
                    onChange={(event) => setAddress(event.target.value)}
                    readOnly={!modify}
                  />
                </div>
                <div className={`${styles.modalText}`}>
                  <label htmlFor="phone">연락처: </label>
                  <input
                    type="text"
                    id="phone"
                    className={styles.custom_input}
                    name="phone"
                    value={phone}
                    onChange={(event) => setPhone(event.target.value)}
                    readOnly={!modify}
                  />
                </div>
                <div className={`${styles.modalText}`}>
                  <label htmlFor="firstResponder">보호자 연락처: </label>
                  <input
                    type="text"
                    id="firstResponder"
                    name="firstResponder"
                    value={firstResponder}
                    onChange={(event) => setFirstResponder(event.target.value)}
                    readOnly={!modify}
                  />
                </div>
                <div className={`${styles.modalText}`}>
                  <label htmlFor="classId">반Id: </label>
                  <input
                    type="text"
                    id="classId"
                    name="classId"
                    value={classId}
                    onChange={(event) => setClassId(event.target.value)}
                    readOnly={!modify}
                  />
                </div>
                <div className={`${styles.modalText}`}>
                  <label htmlFor="statusCode">상태: </label>
                  <input
                    type="text"
                    id="statusCode"
                    name="statusCode"
                    value={statusCode}
                    onChange={(event) => setStatusCode(event.target.value)}
                    readOnly={!modify}
                  />
                </div>
                <div className={`${styles.modalText}`}>
                  <label htmlFor="tabletNo">테블릿 번호: </label>
                  <input
                    type="text"
                    id="tabletNo"
                    name="tabletNo"
                    value={tabletNo}
                    onChange={(event) => setTabletNo(event.target.value)}
                    readOnly={!modify}
                  />
                </div>
                {regist && (
                  <div className={`${styles.modalText}`}>
                    <label htmlFor="face">얼굴 사진: </label>
                    <input
                      type="file"
                      id="face"
                      name="face"
                      accept="image/*"
                      // value={img}
                      onChange={(event) => {
                        // console.log(event.target.files[0]);
                        setImg(event.target.files[0]);
                      }}
                    />
                  </div>
                )}
                {regist && (
                  <div className={`${styles.modalText}`}>
                    <label htmlFor="gender">성별: </label>
                    <input
                      type="text"
                      id="gender"
                      name="gender"
                      value={gender}
                      onChange={(event) => setGender(event.target.value)}
                      readOnly={!modify}
                    />
                  </div>
                )}
              </div>
            </div>
            {regist ? (
              <div>
                <button className={styles.motify} onClick={applyRegist}>
                  등록
                </button>
              </div>
            ) : !modify ? (
              <div className={styles.btnset}>
                <button className={styles.motify} onClick={modifyChange}>
                  수정
                </button>
                <button className={styles.cancle} onClick={deleteTeacher}>
                  삭제
                </button>
              </div>
            ) : (
              <div className={styles.btnset}>
                <button className={styles.motify} onClick={applyModify}>
                  수정하기
                </button>
                <button className={styles.cancle} onClick={cancelModify}>
                  취소
                </button>
              </div>
            )}

            {/* {!modify ? (
              <div>
                <button onClick={modifyChange}>수정</button>
                <button onClick={deleteTeacher}>삭제</button>
              </div>
            ) : (
              <div>
                <button onClick={applyModify}>수정하기</button>
                <button onClick={cancelModify}>취소</button>
              </div>
            )} */}
          </div>
        )}
      </div>
    </div>
  );
};

export default StudyClassPage;
