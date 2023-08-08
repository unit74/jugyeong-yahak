import "./App.css";
import React, { useEffect, useState } from "react";
import { Route, Routes, BrowserRouter, useLocation } from "react-router-dom";
import { Provider } from "react-redux";
import store from "./store"; // Redux Store를 import 해야 함

// pages
// Common
import NotFound from "./pages/Common/NotFound";

// Government
import GovernmentMainPage from "./pages/Government/MainPage";
import StudyClassPage from "./pages/Government/ClassPage";

//Student
// Student_혼자학습
import StudentMain from "./pages/Student/StudentMain";
import StudentReviewTheme from "./pages/Student/StudentReviewTheme";
import WordsListComponent from "./pages/Student/WordsListComponent";

import StudentSpeakingVideo from "./pages/Student/StudentSpeakingVideo";
import StudentReviewWord from "./pages/Student/StudentReviewWord";
import StudentRecordWord from "./pages/Student/StudentRecordWord";
import GoodFeedback from "./pages/Student/GoodFeedback";
import BadFeedback from "./pages/Student/BadFeedback";
import WritingCamTest from "./pages/Student/WritingCamTest";
import TeachableMachineTest from "./pages/Student/TeachableMachineTest";
import StudentDictationMain from "./pages/Student/StudentDictationMain";
import StudentDictationVideo from "./pages/Student/StudentDictationVideo";
import StudentDictationQuestion from "./pages/Student/StudentDictationQuestion";
import StudentDictationAnswer from "./pages/Student/StudentDictationAnswer";
import StudentDiary from "./pages/Student/StudentDiary";
import StudentTalking from "./pages/Student/StudentTalking";

import StudentDone from "./pages/Student/StudentDone";
import CanvasTest from "./pages/Student/CanvasTest";

// Student_실시간 강의
import StudentLive from "./pages/Student/StudentLive";

// Teacher
// Teacher_기타
import TeacherMain from "./pages/Teacher/TeacherMain";
import TeacherStudentInfo from "./pages/Teacher/TeacherStudentInfo";
import TeacherStudentProgress from "./pages/Teacher/TeacherStudentProgress";
import TeacherTheme from "./pages/Teacher/TeacherTheme";
import ThemeCarousel from "./pages/Teacher/ThemeCarousel";

// Teacher_실시간 강의
import TeacherLive from "./pages/Teacher/TeacherLive";
import FaceLogin from "./pages/Common/FaceLogin";
import TTS from "./pages/Common/TTS";

function App() {
  const location = useLocation(); // 현재의 location 정보를 얻습니다.
  const [showTTS, setShowTTS] = useState(false);

  useEffect(() => {
    console.log(location);
    // 여기에 TTS를 실행하는 코드를 추가합니다.
    // 예를 들면, 특정 페이지에만 TTS를 실행하게 할 수 있습니다.
    if (location.pathname === "/review-theme") {
      console.log("location확인전 set함수", showTTS);
      setShowTTS(true);
      console.log("location확인후 set함수", showTTS);
    }
  }, [location]); // location에 변화가 있을 때마다 useEffect 내의 코드가 실행됩니다.

  useEffect(() => {
    console.log("showTTS확인전 set함수", showTTS);
    if (showTTS) setShowTTS(false);
    console.log("showTTS확인후 set함수", showTTS);
  }, [showTTS]);

  return (
    <Provider store={store}>
      {/* showTTS true값으로 바뀌면서 렌더링이 다시되고
      TTS가 다시 실행 되서 <prosody rate="-30.00%"> 김나연 바보 </prosody>
      사이에 있는 '김나연 바보'가 출력된다 
      prosody rate="-30.00%" 음성속도 70퍼센트 */}
      {showTTS && location.pathname === "/review-theme" && (
        <TTS ssml='<speak version="1.0" xmlns="http://www.w3.org/2001/10/synthesis" xml:lang="ko-KR"> <voice name="ko-KR-InJoonNeural"> <prosody rate="-30.00%"> 이동규 천재 </prosody> </voice> </speak>' />
      )}
      <Routes>
        {/* Student */}
        {/* 혼자학습 */}
        <Route exact path="/" element={<StudentMain />} />
        <Route path="/review-theme" element={<StudentReviewTheme />} />
        <Route path="/words-list" element={<WordsListComponent />} />

        <Route path="/speaking-video" element={<StudentSpeakingVideo />} />
        <Route path="/review-word" element={<StudentReviewWord />} />
        <Route path="/record-word" element={<StudentRecordWord />} />
        <Route path="/good-feedback" element={<GoodFeedback />} />
        <Route path="/bad-feedback" element={<BadFeedback />} />
        <Route path="/dictation-main" element={<StudentDictationMain />} />
        <Route path="/dictation-video" element={<StudentDictationVideo />} />
        <Route
          path="/dictation-question"
          element={<StudentDictationQuestion />}
        />
        <Route path="/dictation-answer" element={<StudentDictationAnswer />} />
        <Route path="/diary" element={<StudentDiary />} />
        <Route path="/student-done" element={<StudentDone />} />
        <Route path="/student-talking" element={<StudentTalking />} />
        <Route path="/canvas-test" element={<CanvasTest />} />

        {/* 학생 실시간 강의 */}
        <Route path="/student-live" element={<StudentLive />} />

        {/* <Route path="*" element={<Error404 />} /> */}
        {/* Teacher */}
        <Route path="/teacher-main" element={<TeacherMain />} />
        <Route path="/teacher-studentinfo" element={<TeacherStudentInfo />} />
        <Route path="/teacher-theme" element={<TeacherTheme />} />
        <Route
          path="/teacher-studentprogress"
          element={<TeacherStudentProgress />}
        />
        <Route path="/carousel" element={<ThemeCarousel />} />

        {/* 교사 실시간 강의 */}
        {/* <Route path="/teacher-live" element={<TeacherLive />} /> */}

        {/* 지자체 */}
        {/* <Route path="governmentmain" element={<GovernmentMainPage />} />
        <Route
          path="governmentmain/studyclasspage"
          element={<StudyClassPage />}
        /> */}

        {/* 테스트 컴포넌트 */}
        {/* <Route path="/writing-cam-test" element={<WritingCamTest />} />
        <Route path="/TeachableMachineTest" element={<TeachableMachineTest />} /> */}
        <Route path="/facetest" element={<FaceLogin />} />
        {/* Common */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Provider>
  );
}

export default App;
