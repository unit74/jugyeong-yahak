import React from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import styles from "./ThemeCarousel.module.css";

const TopicSlider = () => {
  const settings = {
    dots: true,
    infinite: true,
    autoplay: true,
    speed: 3500,
    autoplaySpeed: 3500,
    slidesToShow: 4,
    slidesToScroll: 4,
    cssEase: "linear",
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 5,
          slidesToScroll: 3,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };

  return (
    <div className={styles.topicsContainer}>
      <Slider {...settings} className={styles.slider}>
        <div className={styles.topicBox}>
          <img alt="" src="/school.jfif" />
          <div>학교</div>
        </div>
        <div className={styles.topicBox}>
          <img alt="" src="/market.jpg" />
          <div>시장</div>
        </div>
        <div className={styles.topicBox}>
          <img alt="" src="/cook.jfif" />
          <div>요리</div>
        </div>
        <div className={styles.topicBox}>
          <img alt="" src="/family.jpg" />
          <div>가족</div>
        </div>
        <div className={styles.topicBox}>
          <img alt="" src="/cleaning.jfif" />
          <div>청소</div>
        </div>
        <div className={styles.topicBox}>
          <img alt="" src="/seniorzone.jfif" />
          <div>경로당</div>
        </div>
        <div className={styles.topicBox}>
          <img alt="" src="/train.jfif" />
          <div>기차여행</div>
        </div>
        <div className={styles.topicBox}>
          <img alt="" src="/hospital.jpg" />
          <div>병원</div>
        </div>
        <div className={styles.topicBox}>
          <img alt="" src="/center.jpg" />
          <div>행정복지센터</div>
        </div>
        <div className={styles.topicBox}>
          <img alt="" src="/bank.jpg" />
          <div>은행</div>
        </div>
      </Slider>
    </div>
  );
};

export default TopicSlider;
