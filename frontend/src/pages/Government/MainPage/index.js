import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Nav from "../../Common/Nav";
import Banner from "../components/Banner";
import HelpTask from "../components/HelpTask";
import InformationCheck from "../../Common/InformationCheck";
import styles from "./government.module.css";

const GovernmentMainPage = () => {
  const navigate = useNavigate();
  const userInfo = JSON.parse(localStorage.getItem("userInfo"));

  const handleClick_1 = () => {
    navigate("/governmentmain/studystudentpage");
  };

  const handleClick_2 = () => {
    navigate("/governmentmain/studyteacherpage");
  };

  const handleClick_3 = () => {
    navigate("/governmentmain/studyclasspage");
  };

  const logoutClick = () => {
    navigate("/logout");
  };



  return (
    <div className={styles.main}>

      <div className={styles.back}>
        <button className={styles.logout} onClick={logoutClick}>
          Logout
        </button>
        <div className={styles.bannerContainer}>
          <section className={styles.welcome}>
            <div className={styles.typing1}> 배움에 대한 기쁨은 나누고  </div>

            <div className={styles.typing2}> 배움의 열정을 더하다 </div>
            <span style={{ display: "block", textAlign: "center" }}>
              주경야학과 함께라면, 언제 어디서든 야학 봉사가 가능합니다!
            </span>
          </section>
        </div>
        {/* 네모 박스 시작 */}

        <section className={styles.options}>
          <article className={styles.option} onClick={handleClick_1}>
            <div className={styles.optionImage}></div>
            <div className={styles.optionText}>
              <p>학생 정보</p>
              <p>확인하기</p>
            </div>
            <img
              className={`${styles.optionIcon} ${styles.enlargedIcon}`}
              alt=""
              src="/group-2175.svg"
            />
          </article>

          <article className={styles.option} onClick={handleClick_2}>
            <div className={styles.optionImage}></div>
            <div className={styles.optionText}>
              <p>선생님 정보</p>
              <p>확인하기</p>
            </div>
            <img className={styles.optionIcon} alt="" src="/twemojiwomanteacher.svg" />
          </article>

          <article className={styles.option} onClick={handleClick_3}>
            <div className={styles.optionImage}></div>
            <div className={styles.optionText}>
              <p>반 정보</p>
              <p>확인하기</p>
            </div>
            <img className={styles.optionIcon} alt="" src="/group-2176.svg" />
          </article>
        </section>



      </div>
    </div>
  );
};

export default GovernmentMainPage;
