import "./App.css";
import React, { useEffect } from "react";
import { Route, Routes, BrowserRouter } from "react-router-dom";

// pages
// Common
import NotFound from "./pages/Common/NotFound";

//Student
import StudentMain from "./pages/Student/StudentMain";

// Teacher
import TeacherMain from "./pages/Teacher/TeacherMain";
import TeacherLive from "./pages/Teacher/TeacherLive";
import TeacherStudentInfo from "./pages/Teacher/TeacherStudentInfo";
import TeacherStudentProgress from "./pages/Teacher/TeacherStudentProgress";

function App() {
  return (
    <>
      <Routes>
        {/* Common */}
        <Route path="*" element={<NotFound />} />

        {/* Student */}
        <Route exact path="/" element={<StudentMain />} />

        {/* Teacher */}
        <Route path="/teacher-main" element={<TeacherMain />} />
        <Route path="/teacher-live" element={<TeacherLive />} />
        <Route path="/teacher-studentinfo" element={<TeacherStudentInfo />} />
        <Route
          path="/teacher-studentprogress"
          element={<TeacherStudentProgress />}
        />
      </Routes>
    </>
  );
}

export default App;
