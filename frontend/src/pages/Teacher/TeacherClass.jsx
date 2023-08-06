import React from 'react';
import { useNavigate } from 'react-router-dom';

const TeacherClass = () => {
  const navigate = useNavigate();
  // axios 해서 Class 목록을 얻어오자.
  const classes = [
    {
      no: 1,
      name: '새싹반',
    },
    {
      no: 2,
      name: '고래반',
    },
    {
      no: 3,
      name: '샘플1반',
    },
    {
      no: 4,
      name: '샘플2반',
    },
    {
      no: 5,
      name: '샘플3반',
    },
  ];

  const handleClickClass = (clazz) => {
    alert(clazz.name + '의 실시간 강의를 열겠습니다.');
    navigate('/teacher-live', { state: { clazz: clazz } });
  };

  return (
    <div>
      {classes.map((clazz, idx) => {
        return (
          <p key={idx}>
            <button onClick={() => handleClickClass(clazz)}>{clazz.name}의 라이브 강의 열기</button>
          </p>
        );
      })}
    </div>
  );
};

export default TeacherClass;
