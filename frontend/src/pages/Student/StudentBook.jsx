import React, { useState, useEffect } from "react";
import styles from "./StudentBook.module.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { CSSTransition } from "react-transition-group";

export default function StudentBook() {
  const navigate = useNavigate();
  const [fade, setFade] = useState(false);
  const [book, setBook] = useState([]);

  book.push({ theme: "병원", status: 5 });
  book.push({ theme: "시장", status: 2 });
  book.push({ theme: "학교", status: 0 });
  book.push({ theme: "학원", status: 4 });
  book.push({ theme: "정희", status: 5 });

  const bookAnimationClassNames = {
    appearActive: styles.bounceIn,
  };

  const bookStyle = {
    transform: "perspective(1000px) rotateY(-17deg)",
  };

  // useEffect(() => {
  //   axios
  //     .get("https://i9e206.p.ssafy.io/api/v1/themes/8")
  //     .then((response) => {})
  //     .catch((error) => console.error(`Error: ${error}`));
  // }, []);

  return (
    <div className={`${styles.main} ${fade ? styles.fadeOut : ""}`}>
      <div className={styles.square}>
        <div className={styles.books}>
          <b className={styles.greeting}>현재 공부</b>
          {book.map((sub, i) => (
            <CSSTransition in={true} appear timeout={5000} classNames={bookAnimationClassNames}>
              <div className={`${styles.book} ${styles[`book${i + 1}`]}`} style={bookStyle}>
                {sub.theme + "  :  "}
                {sub.status === 0 ? "시작 안함" : sub.status === 5 ? "완료됨" : "공부 중"}
              </div>
            </CSSTransition>
          ))}
          {/* <CSSTransition in={true} appear timeout={5000} classNames={bookAnimationClassNames}>
            <div className={`${styles.book} ${styles.book1}`} style={bookStyle} />
          </CSSTransition>
          <CSSTransition in={true} appear timeout={5000} classNames={bookAnimationClassNames}>
            <div className={`${styles.book} ${styles.book2}`} style={bookStyle} />
          </CSSTransition>
          <CSSTransition in={true} appear timeout={5000} classNames={bookAnimationClassNames}>
            <div className={`${styles.book} ${styles.book3}`} style={bookStyle} />
          </CSSTransition>
          <CSSTransition in={true} appear timeout={5000} classNames={bookAnimationClassNames}>
            <div className={`${styles.book} ${styles.book4}`} style={bookStyle} />
          </CSSTransition>
          <CSSTransition in={true} appear timeout={5000} classNames={bookAnimationClassNames}>
            <div className={`${styles.book} ${styles.book5}`} style={bookStyle} />
          </CSSTransition> */}
        </div>
      </div>
    </div>
  );
}
