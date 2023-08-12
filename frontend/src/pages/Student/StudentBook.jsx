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

  const bookStyle = (status) => {
    let baseStyle = {
      transform: "perspective(1000px) rotateY(-17deg)",
    };

    if (status === 5) {
      return {
        ...baseStyle,
        boxShadow: "0 0 20px rgba(255,255,255,0.9)", // 불켜
      };
    } else if (status === 0) {
      return {
        ...baseStyle,
        opacity: 0.5, // 불꺼
      };
    }

    return baseStyle;
  };
  useEffect(() => {
    // 일단 인증정보 그냥 넣어둠
    axios
      .get("https://i9e206.p.ssafy.io/api/v1/members/libraries", {
        headers: {
          Authorization:
            "Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzUxMiJ9.eyJleHAiOjE2OTE1NDA1NDcsInN1YiI6ImFjY2Vzcy10b2tlbiIsImlkZW50aWZpY2F0aW9uIjoiNCIsInJvbGUiOiJST0xFX1NUVURFTlQifQ.sZoEZuhJNGgc18Qgdu-5DEA6fcf9dJPP16K3u_EGmVbOWrpplMp_5dBqXgRhvBzw5r2Mce_WtI605sVaw3EI1w",
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
        <b className={styles.greeting}>현재 공부</b>
        <div className={styles.books}>
          {/* 책 정렬 / 공부중 완료됨 시작안함 순서*/}
          {book
            .sort((a, b) => {
              if (a.status === 0 || b.status === 0) return b.status - a.status;
              if (a.status === 5 || b.status === 5) return a.status - b.status;
              return a.status - b.status;
            })
            .map((sub, i) => (
              <CSSTransition in={true} appear timeout={5000} classNames={bookAnimationClassNames}>
                <div
                  id={`book${i + 1}`}
                  className={`${styles.book} ${styles[`book${i + 1}`]}`}
                  style={bookStyle(sub.status)}
                >
                  <div className={styles.bookText}>
                    {sub.themeName + "  :  "}
                    {sub.status === 0 ? "시작 안함" : sub.status === 5 ? "완료됨" : "공부 중"}
                  </div>
                </div>
              </CSSTransition>
            ))}
        </div>
      </div>
    </div>
  );
}
