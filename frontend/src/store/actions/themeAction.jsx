// 개별 테마 상세 정보
import axios from 'axios';
import { FETCH_THEME_SUCCESS } from './types';

export const fetchTheme = () => async (dispatch) => {
  try {
    // 1에서 10 사이의 랜덤한 themeId 생성
    const themeId = Math.floor(Math.random() * 10) + 1;

    const response = await axios.get(`https://i9e206.p.ssafy.io/api/v1/themes/8`);
    const themeData = response.data.data; // 테마정보
    const wordsList = response.data.data.wordList; // 단어 5개 정보


    dispatch({
      type: FETCH_THEME_SUCCESS,
      payload: {themeData, wordsList},
    });
  } catch (error) {
    // 오류 처리를 원한다면 여기서 핸들링
    console.error('Error fetching themeData:', error);
  }
};
