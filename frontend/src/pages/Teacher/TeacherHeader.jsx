import React, { useState } from "react";
import styles from "./TeacherHeader.module.css";
import { useNavigate } from "react-router-dom";

const TeacherHeader = () => {
  const userInfo = JSON.parse(localStorage.getItem("userInfo"));
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const navigate = useNavigate();

  const handleSidebarToggle = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const logoutClick = () => {
    navigate("/logout");
  };

  return (
    <>
      {/* 사이트바 버튼 */}
      <div className={styles.sidebarToggle} onClick={handleSidebarToggle}>
        <span className={styles.sidebarToggleIcon}>
          {isSidebarOpen ? "◀" : "▶"}
        </span>
      </div>

      {/* 사이트바 */}
      <aside
        className={`${styles.sidebar} ${isSidebarOpen ? styles.open : ""}`}
      >
        <span className={styles.logo}>주경야학</span>
        <b className={styles.username}>{`${userInfo.name} 봉사자님`}</b>
        <button className={styles.logout} onClick={logoutClick}>
          Logout
        </button>
      </aside>
    </>
  );
};

export default TeacherHeader;
