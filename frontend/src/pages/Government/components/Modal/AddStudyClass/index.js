import React, { useRef } from 'react'
import useOnClickOutside from '../../../Common/hooks/useOnClickOutside';


const AddStudyClass = ({
    // 반추가 위한 테이블들
    setModalOpen
}) => {

  const ref = useRef(); // useRef를 통해 리액트에서 커서가 무엇을 가르키고 있는지 확인한다.

  useOnClickOutside(ref, () => {setModalOpen(false)}); // useOnClickOutside 불러와서 바깥에 찍으면 false로 만들어

  return (
    <div ref={ref}>
        {/* ref를 적어줘서 modal을 리액트가 hooks로 확인함 */}
        StudyClassModal
    </div>
  )
}

export default AddStudyClass