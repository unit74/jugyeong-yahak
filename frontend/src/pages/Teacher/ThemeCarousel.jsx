import React from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import styles from "./ThemeCarousel.module.css";

const TopicSlider = () => {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 4,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
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
      <Slider {...settings}>
        <div className={styles.topicBox}>
          <img alt="" src="/image-72@2x.png" />
          <div>학교</div>
        </div>
        <div className={styles.topicBox}>
          <img alt="" src="/image-73@2x.png" />
          <div>시장</div>
        </div>
        <div className={styles.topicBox}>
          <img alt="" src="/image-74@2x.png" />
          <div>주방</div>
        </div>
        <div className={styles.topicBox}>
          <img alt="" src="/image-75@2x.png" />
          <div>병원</div>
        </div>
        <div className={styles.topicBox}>
          <img alt="" src="/image-76@2x.png" />
          <div>약국</div>
        </div>
      </Slider>
    </div>
  );
};

export default TopicSlider;
