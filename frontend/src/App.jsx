import './App.css';
import React, { useEffect } from 'react';
import { Route, Routes, BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import store from './store'; // Redux Store를 import 해야 함

// pages
// Common
import NotFound from './pages/Common/NotFound';

// Government
import GovernmentMainPage from './pages/Government/MainPage';
import StudyClassPage from './pages/Government/ClassPage';

//Student
// Student_혼자학습
import StudentMain from './pages/Student/StudentMain';
import StudentReviewTheme from './pages/Student/StudentReviewTheme';
import WordsListComponent from './pages/Student/WordsListComponent';

import StudentSpeakingVideo from './pages/Student/StudentSpeakingVideo';
import StudentReviewWord from './pages/Student/StudentReviewWord';
import StudentRecordWord from './pages/Student/StudentRecordWord';
import GoodFeedback from './pages/Student/GoodFeedback';
import BadFeedback from './pages/Student/BadFeedback';
import WritingCamTest from './pages/Student/WritingCamTest';
import TeachableMachineTest from './pages/Student/TeachableMachineTest';
import StudentDictationMain from './pages/Student/StudentDictationMain';
import StudentDictationVideo from './pages/Student/StudentDictationVideo';
import StudentDictationQuestion from './pages/Student/StudentDictationQuestion';
import StudentDictationAnswer from './pages/Student/StudentDictationAnswer';
import StudentDiary from './pages/Student/StudentDiary';

import StudentDone from './pages/Student/StudentDone';

// Student_실시간 강의
import StudentLive from './pages/Student/StudentLive';

// Teacher
// Teacher_기타
import TeacherMain from './pages/Teacher/TeacherMain';
import TeacherStudentInfo from './pages/Teacher/TeacherStudentInfo';
import TeacherStudentProgress from './pages/Teacher/TeacherStudentProgress';
import TeacherTheme from './pages/Teacher/TeacherTheme';
import TeacherClass from './pages/Teacher/TeacherClass';
import ThemeCarousel from './pages/Teacher/ThemeCarousel';

// Teacher_실시간 강의
import TeacherLive from './pages/Teacher/TeacherLive';
import FaceLogin from './pages/Common/FaceLogin';

function App() {
  return (
    <Provider store={store}>
      <Routes>
        {/* Common */}
        <Route path='*' element={<NotFound />} />

        {/* Student */}
        {/* 혼자학습 */}
        <Route exact path='/' element={<StudentMain />} />
        <Route path='/review-theme' element={<StudentReviewTheme />} />
        <Route path='/words-list' element={<WordsListComponent />} />

        <Route path='/speaking-video' element={<StudentSpeakingVideo />} />
        <Route path='/review-word' element={<StudentReviewWord />} />
        <Route path='/record-word' element={<StudentRecordWord />} />
        <Route path='/good-feedback' element={<GoodFeedback />} />
        <Route path='/bad-feedback' element={<BadFeedback />} />
        <Route path='/dictation-main' element={<StudentDictationMain />} />
        <Route path='/dictation-video' element={<StudentDictationVideo />} />
        <Route path='/dictation-question' element={<StudentDictationQuestion />} />
        <Route path='/dictation-answer' element={<StudentDictationAnswer />} />
        <Route path='/diary' element={<StudentDiary />} />
        <Route path='/student-done' element={<StudentDone />} />

        {/* 학생 실시간 강의 */}
        <Route path='/student-live' element={<StudentLive />} />

        {/* <Route path="*" element={<Error404 />} /> */}
        {/* Teacher */}
        <Route path='/teacher-main' element={<TeacherMain />} />
        <Route path='/teacher-studentinfo' element={<TeacherStudentInfo />} />
        <Route path='/teacher-theme' element={<TeacherTheme />} />
        <Route path='/teacher-class' element={<TeacherClass />} />
        <Route path='/teacher-studentprogress' element={<TeacherStudentProgress />} />
        <Route path='/carousel' element={<ThemeCarousel />} />

        {/* 교사 실시간 강의 */}
        <Route path='/teacher-live' element={<TeacherLive />} />

        {/* 지자체 */}
        {/* <Route path="governmentmain" element={<GovernmentMainPage />} />
        <Route
          path="governmentmain/studyclasspage"
          element={<StudyClassPage />}
        /> */}

        {/* 테스트 컴포넌트 */}
        {/* <Route path="/writing-cam-test" element={<WritingCamTest />} />
        <Route path="/TeachableMachineTest" element={<TeachableMachineTest />} /> */}
        <Route path='/facetest' element={<FaceLogin />} />
      </Routes>
    </Provider>
  );
}

export default App;
