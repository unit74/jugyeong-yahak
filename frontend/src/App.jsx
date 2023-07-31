import "./App.css";
import React, { useEffect } from "react";
import { Route, Routes, BrowserRouter } from "react-router-dom";

// pages
import StudentMain from "./pages/Student/StudentMain";
import Error404 from "./pages/Common/Error404";
import TeacherMain from "./pages/Teacher/TeacherMain";

function App() {
  return (
    <>
      <Routes>
        <Route exact path="/" element={<StudentMain />} />
        <Route path="/teachermain" element={<TeacherMain />} />
        {/* 나머지 라우터 여기에 설계할 것 */}
        <Route path="*" element={<Error404 />} />
      </Routes>
    </>
  );
}

export default App;
