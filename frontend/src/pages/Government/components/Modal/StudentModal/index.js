import React, { useRef } from "react";
import useOnClickOutside from "../../../../Common/hooks/useOnClickOutside";

const StudentModal = ({
  //   사용자 정보 prop 받아서 밑에서 보여줌
  // 사용자이름
  // 전화번호
  // 주소
  // 얼굴이미지
  // 태블릿번호 등등
  setModalOpen,
}) => {
  const ref = useRef(); // useRef를 통해 리액트에서 커서가 무엇을 가르키고 있는지 확인한다.

  useOnClickOutside(ref, () => {
    setModalOpen(false);
  }); // useOnClickOutside 불러와서 바깥에 찍으면 false로 만들어

  return (
    <div ref={ref}>
      {/* ref를 적어줘서 modal을 리액트가 hooks로 확인함 */}
      StudyClassModal
    </div>
  );
};

export default StudentModal;
