import React, { useState, useEffect } from "react";
import styles from "./StudentBook.module.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { CSSTransition } from "react-transition-group";

export default function StudentBook() {
  const navigate = useNavigate();
  const [fade, setFade] = useState(false);
  const [book, setBook] = useState([]);

  const bookAnimationClassNames = {
    appearActive: styles.bounceIn,
  };

  const bookStyle = {
    transform: "perspective(1000px) rotateY(-17deg)",
  };

  useEffect(() => {
    // 일단 인증정보 그냥 넣어둠
    axios
      .get("https://i9e206.p.ssafy.io/api/v1/members/libraries", {
        headers: {
          Authorization:
            "Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzUxMiJ9.eyJleHAiOjE2OTE1MTE0NTgsInN1YiI6ImFjY2Vzcy10b2tlbiIsImlkZW50aWZpY2F0aW9uIjoiMTIiLCJyb2xlIjoiUk9MRV9TVFVERU5UIn0.jpy8sqMLP4VEbD0AOYqC0pNG6aLNxeygDASyOi03cnBRxt7U0Fy2kARB2bsm81U0EbUe5unQOqlkod-D6rbdBQ",
        },
      })
      .then((response) => {
        setBook(response.data.data.list);
      })
      .catch((error) => console.error(`Error: ${error}`));
  }, []);

  return (
    <div className={`${styles.main} ${fade ? styles.fadeOut : ""}`}>
      <div className={styles.square}>
        <div className={styles.books}>
          <b className={styles.greeting}>현재 공부</b>
          {book.map((sub, i) => (
            <CSSTransition in={true} appear timeout={5000} classNames={bookAnimationClassNames}>
              <div
                id={`book${i + 1}`}
                className={`${styles.book} ${styles[`book${i + 1}`]}`}
                style={bookStyle}
              >
                {sub.themeName + "  :  "}
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
