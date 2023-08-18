import "./App.css";
import React, { useEffect, useState } from "react";
import { Route, Routes, useNavigate } from "react-router-dom";
import { EventSourcePolyfill } from "event-source-polyfill";
import { Provider } from "react-redux";
import store from "./store"; // Redux Store를 import 해야 함

// pages
// Common
import NotFound from "./pages/Common/NotFound";
import PrivateRoute from "./components/PrivateRoute";
import Logout from "./pages/Common/logout";

// Government
import GovernmentMainPage from "./pages/Government/MainPage";
import StudyClassPage from "./pages/Government/ClassPage";
import StudyStudentPage from "./pages/Government/StudentPage";
import StudyTeacherPage from "./pages/Government/TeacherPage";
import GovernmentLogin from "./pages/Government/GovernmentLogin";

//Student
// Student_혼자학습
import StudentMain from "./pages/Student/StudentMain";
import StudentBook from "./pages/Student/StudentBook";
import StudentNote from "./pages/Student/StudentNote";
import StudentDiaryList from "./pages/Student/StudentDiaryList";
import StudentReviewTheme from "./pages/Student/StudentReviewTheme";
import StudentSituation from "./pages/Student/StudentSituation";
import WordsListComponent from "./pages/Student/WordsListComponent";
import StudentReviewWord from "./pages/Student/StudentReviewWord";

// import StudentSpeakingVideo from "./pages/Student/StudentSpeakingVideo";
import StudentReadingMain from "./pages/Student/StudentReadingMain";
import StudentWordExplain from "./pages/Student/StudentWordExplain";
import StudentRecordWord from "./pages/Student/StudentRecordWord";
import GoodFeedback from "./pages/Student/GoodFeedback";
import BadFeedback from "./pages/Student/BadFeedback";
import DictaionFeedback from "./pages/Student/DictationFeedback";

import StudentDictationVideo from "./pages/Student/StudentDictationVideo";
import StudentDictationQuestion from "./pages/Student/StudentDictationQuestion";
import StudentDictationAnswer from "./pages/Student/StudentDictationAnswer";
import StudentDiary from "./pages/Student/StudentDiary";
import StudentDiaryMain from "./pages/Student/StudentDiaryMain";
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
import TeacherClass from "./pages/Teacher/TeacherClass";
import TeacherLive from "./pages/Teacher/TeacherLive";

// 실시간 강의
import LiveTheme from "./pages/Live/LiveTheme";
import LiveCurriculum from "./pages/Live/LiveCurriculum";
import LiveJournal from "./pages/Live/LiveJournal";
import LiveReadWord from "./pages/Live/LiveReadWord";
import LiveReadWordHint from "./pages/Live/LiveReadWordHint";
import LiveWriteWord from "./pages/Live/LiveWriteWord";
import LiveWirteWordHint from "./pages/Live/LiveWirteWordHint";
import LiveTeacherGuessQuiz from "./pages/Live/LiveTeacherGuessQuiz";
import LiveTeacherChoseongQuiz from "./pages/Live/LiveTeacherChoseongQuiz";
import LiveGood from "./pages/Live/LiveGood";
import LiveBad from "./pages/Live/LiveBad";
import LiveEnd from "./pages/Live/LiveEnd";
import LiveWait from "./pages/Live/LiveWait";
import LiveStudentGuessQuiz from "./pages/Live/LiveStudentGuessQuiz";
import LiveStudentChoseongQuiz from "./pages/Live/LiveStudentChoseongQuiz";

import FaceLogin from "./pages/Common/FaceLogin";

function App() {
  useEffect(() => {
    // 이벤트 핸들러 함수 정의
    const handleBeforeUnload = (event) => {
      localStorage.removeItem("userInfo");
      localStorage.removeItem("accessToken");
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, []);

  return (
    <Provider store={store}>
      <Routes>
        {/* Student */}
        {/* 혼자학습 */}
        <Route
          path="/"
          element={
            <PrivateRoute>
              <StudentMain />
            </PrivateRoute>
          }
        />
        <Route path="/student-note" element={<StudentNote />} />
        <Route path="/book" element={<StudentBook />} />
        <Route path="/review-theme" element={<StudentReviewTheme />} />
        <Route path="/diary-list" element={<StudentDiaryList />} />
        <Route path="/situation" element={<StudentSituation />} />
        <Route path="/words-list" element={<WordsListComponent />} />
        {/* <Route path="/speaking-video" element={<StudentSpeakingVideo />} /> */}

        <Route path="/reading-main" element={<StudentReadingMain />} />
        <Route path="/word-explain" element={<StudentWordExplain />} />
        <Route path="/review-word" element={<StudentReviewWord />} />
        <Route path="/record-word" element={<StudentRecordWord />} />
        <Route path="/good-feedback" element={<GoodFeedback />} />
        <Route path="/bad-feedback" element={<BadFeedback />} />
        <Route path="/dictation-feedback" element={<DictaionFeedback />} />
        <Route path="/dictation-video" element={<StudentDictationVideo />} />
        <Route path="/dictation-question" element={<StudentDictationQuestion />} />
        <Route path="/dictation-answer" element={<StudentDictationAnswer />} />
        <Route path="/diary" element={<StudentDiary />} />
        <Route path="/student-done" element={<StudentDone />} />
        <Route path="/diary-main" element={<StudentDiaryMain />} />
        <Route path="/student-talking" element={<StudentTalking />} />
        <Route path="/canvas-test" element={<CanvasTest />} />
        {/* 학생 실시간 강의 */}
        <Route path="/student-live" element={<StudentLive />}>
          <Route path="theme" element={<LiveWait />} />
          <Route path="curriculum" element={<LiveWait />} />
          <Route path="journal" element={<LiveJournal />} />
          <Route path="read" element={<LiveReadWord />} />
          <Route path="read-hint" element={<LiveReadWordHint />} />
          <Route path="write" element={<LiveWriteWord />} />
          <Route path="write-hint" element={<LiveWirteWordHint />} />
          <Route path="guess" element={<LiveStudentGuessQuiz />} />
          <Route path="choseong" element={<LiveStudentChoseongQuiz />} />
          <Route path="good" element={<LiveGood />} />
          <Route path="bad" element={<LiveBad />} />
          <Route path="end" element={<LiveEnd />} />
        </Route>
        {/* <Route path="*" element={<Error404 />} /> */}
        {/* Teacher */}
        <Route path="/teacher-main" element={<TeacherMain />} />
        <Route path="/teacher-studentinfo" element={<TeacherStudentInfo />} />
        <Route path="/teacher-class" element={<TeacherClass />} />
        <Route path="/teacher-studentprogress" element={<TeacherStudentProgress />} />
        {/* 교사 실시간 강의 */}
        <Route path="/teacher-live" element={<TeacherLive />}>
          <Route path="theme" element={<LiveTheme />} />
          <Route path="curriculum" element={<LiveCurriculum />} />
          <Route path="journal" element={<LiveJournal />} />
          <Route path="read" element={<LiveReadWord />} />
          <Route path="read-hint" element={<LiveReadWordHint />} />
          <Route path="write" element={<LiveWriteWord />} />
          <Route path="write-hint" element={<LiveWirteWordHint />} />
          <Route path="guess" element={<LiveTeacherGuessQuiz />} />
          <Route path="choseong" element={<LiveTeacherChoseongQuiz />} />
          <Route path="good" element={<LiveGood />} />
          <Route path="bad" element={<LiveBad />} />
          <Route path="end" element={<LiveEnd />} />
        </Route>
        {/* 지자체 */}
        <Route path="government-login" element={<GovernmentLogin />} />
        <Route path="governmentmain" element={<GovernmentMainPage />} />
        <Route path="governmentmain/studyclasspage" element={<StudyClassPage />} />
        <Route path="governmentmain/studystudentpage" element={<StudyStudentPage />} />
        <Route path="governmentmain/studyteacherpage" element={<StudyTeacherPage />} />

        {/* 테스트 컴포넌트 */}
        {/* <Route path="/writing-cam-test" element={<WritingCamTest />} />
        <Route path="/TeachableMachineTest" element={<TeachableMachineTest />} /> */}
        <Route path="/facetest" element={<FaceLogin />} />
        <Route path="/logout" element={<Logout />} />

        {/* Common */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Provider>
  );
}

export default App;
