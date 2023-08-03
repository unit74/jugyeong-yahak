import React, { useEffect } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import styles from "./ThemeCarousel.module.css";

// axios !!!!!!!!!
import { useDispatch, useSelector } from 'react-redux';
import { fetchAllThemes } from '../../store/actions/allThemesAction';
import { setSelectedTheme } from '../../store/actions/setSelectedThemeAction';

const TopicSlider = () => {
  // axios !!!!!!!!!
  // 테마 리스트 조회
  const dispatch = useDispatch();
  const allThemes = useSelector((state) => state.allThemesState.allThemes);
  const selectedTheme = useSelector((state) => state.selectedTheme);
  
  const setSelctedTheme = (id) => {
    dispatch(setSelectedTheme(id));
  };

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
  
  useEffect(() => {
    // axios !!!!!!!!!
    // allThemes가 비어있을 때만 API 요청을 보냅니다.
    if (allThemes.length === 0) {
      dispatch(fetchAllThemes());
    }
    return () => {
    };
  }, );
  
  console.log(allThemes)

  return (
    <div className={styles.topicsContainer}>
      <Slider {...settings} className={styles.slider}>
      <div>
        {allThemes.map((themeObj, index) => (
          <div 
          onClick={() => setSelctedTheme(themeObj.id)}
          key={index} 
          className={styles.topicBox}
          >
          <img alt="" src={themeObj.themeImageUrl} />
            <div>{themeObj.theme}</div>
            <div>{themeObj.id}</div>
          </div>
        ))}
      </div>
      </Slider>
    </div>
  );
};

export default TopicSlider;
