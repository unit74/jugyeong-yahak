import axios from '../../Common/axios';
import React from 'react'
import { useEffect, useState, useCallback } from 'react';


const AbsMember = ({
  // 선택된 반 아이디로 반에 소속된 사람들 불러오기
}) => {
    const fetchStudyClassData = useCallback(async () => {  // useCallback을 바뀌는 걸 괄호닫은 [] 대괄호 배열에 바뀌는 변수를 넣어준다.
        const response = await axios.get(fetchUrl);  // 그런데 Axios 단축으로 불러오면 axios폴더에서 axios를 가져오니까 위에서 고쳐줘야함
        // console.log("response", response);
        setStudyClasses(response.data.results);
      }, [fetchUrl]);
    
      useEffect(() => {
        fetchStudyClassData();  // fetch
      }, [fetchStudyClassData]) // useCallback과 마찬가지로 fetchMovieData가 변하는걸 넣어준다.
      // 컴포넌트가 실행되면 함수도 새로 생성된다. 하지만 함수를 굳이 재생성 할 필요는 없기 때문에 useCallback을 사용한다.
    return (
    <div>AbsStudent


{
        absMemberLstOpen && // 반을 선택하면 absStudentLstOpen state 값이 true 그 후 학생요약정보 오픈
        <AbsMember // StudyClassModal 컴포넌트 가져오고
          {...studentSelected} // 전개 연산자 ...
          setModalOpen={setModalOpen} // props로 setModalOpen을 내려준다. 
          // 그러고 나면 StudyClassModal의 index.js에 가서 함수에다가 setModalOpen(바꿔줄값) 적어줌 / 바꿔줄 값은 false이다.
        />
      }
    </div>
  )
}

export default AbsMember