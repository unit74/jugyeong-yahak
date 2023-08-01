import "./App.css";
import React, { useEffect } from "react";
import { Route, Routes, BrowserRouter } from "react-router-dom";

// pages
// Common
import NotFound from "./pages/Common/NotFound";

// Government
import GovernmentMainPage from "./pages/Government/MainPage";
import StudyClassPage from "./pages/Government/ClassPage";

//Student
import StudentMain from "./pages/Student/StudentMain";
import StudentReviewTheme from "./pages/Student/StudentReviewTheme";
import StudentSpeakingVideo from "./pages/Student/StudentSpeakingVideo";
import StudentReviewWord from "./pages/Student/StudentReviewWord";
import StudentRecordWord from "./pages/Student/StudentRecordWord";
import GoodFeedback from "./pages/Student/GoodFeedback";
import BadFeedback from "./pages/Student/BadFeedback";

// Teacher
import TeacherMain from "./pages/Teacher/TeacherMain";
import TeacherLive from "./pages/Teacher/TeacherLive";
import TeacherStudentInfo from "./pages/Teacher/TeacherStudentInfo";
import TeacherStudentProgress from "./pages/Teacher/TeacherStudentProgress";
import TeacherTheme from "./pages/Teacher/TeacherTheme";
import ThemeCarousel from "./pages/Teacher/ThemeCarousel";

function App() {
  return (
    <>
      <Routes>
        {/* Common */}
        <Route path="*" element={<NotFound />} />

        {/* Student */}
        <Route exact path="/" element={<StudentMain />} />
        <Route path="/review-theme" element={<StudentReviewTheme />} />
        <Route path="/speaking-video" element={<StudentSpeakingVideo />} />
        <Route path="/review-word" element={<StudentReviewWord />} />
        <Route path="/record-word" element={<StudentRecordWord />} />
        <Route path="/good-feedback" element={<GoodFeedback />} />
        <Route path="/bad-feedback" element={<BadFeedback />} />

        {/* Teacher */}
        <Route path="/teacher-main" element={<TeacherMain />} />
        <Route path="/teacher-live" element={<TeacherLive />} />
        <Route path="/teacher-studentinfo" element={<TeacherStudentInfo />} />
        <Route path="/teacher-theme" element={<TeacherTheme />} />
        <Route
          path="/teacher-studentprogress"
          element={<TeacherStudentProgress />}
        />
        <Route path="/carousel" element={<ThemeCarousel />} />
        {/* 나머지 라우터 여기에 설계할 것 */}
        <Route path="governmentmain" element={<GovernmentMainPage />} />
        <Route
          path="governmentmain/studyclasspage"
          element={<StudyClassPage />}
        />
      </Routes>
    </>
  );
}

export default App;
