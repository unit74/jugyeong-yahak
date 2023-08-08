import React, { useState } from "react";
import styles from "./StudentBook.module.css";
import { useNavigate } from "react-router-dom";
import { CSSTransition } from "react-transition-group";

export default function StudentBook() {
  const navigate = useNavigate();
  const [fade, setFade] = useState(false);

  const bookAnimationClassNames = {
    appearActive: styles.bounceIn,
  };

  const bookStyle = {
    transform: "perspective(1000px) rotateY(-17deg)",
  };

  return (
    <div className={`${styles.main} ${fade ? styles.fadeOut : ""}`}>
      <div className={styles.square}>
        <div className={styles.books}>
          <b className={styles.greeting}>현재 공부</b>
          <CSSTransition
            in={true}
            appear
            timeout={5000}
            classNames={bookAnimationClassNames}
          >
            <div
              className={`${styles.book} ${styles.book1}`}
              style={bookStyle}
            />
          </CSSTransition>
          <CSSTransition
            in={true}
            appear
            timeout={5000}
            classNames={bookAnimationClassNames}
          >
            <div
              className={`${styles.book} ${styles.book2}`}
              style={bookStyle}
            />
          </CSSTransition>
          <CSSTransition
            in={true}
            appear
            timeout={5000}
            classNames={bookAnimationClassNames}
          >
            <div
              className={`${styles.book} ${styles.book3}`}
              style={bookStyle}
            />
          </CSSTransition>
          <CSSTransition
            in={true}
            appear
            timeout={5000}
            classNames={bookAnimationClassNames}
          >
            <div
              className={`${styles.book} ${styles.book4}`}
              style={bookStyle}
            />
          </CSSTransition>
          <CSSTransition
            in={true}
            appear
            timeout={5000}
            classNames={bookAnimationClassNames}
          >
            <div
              className={`${styles.book} ${styles.book5}`}
              style={bookStyle}
            />
          </CSSTransition>
        </div>
      </div>
    </div>
  );
}
