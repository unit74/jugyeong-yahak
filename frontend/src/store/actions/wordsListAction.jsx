// 선정된 테마의 5개 단어 목록
import axios from 'axios';
import { FETCH_WORDSLIST_SUCCESS } from './types';

export const fetchWordsList = () => async (dispatch) => {
  try {
    // 현재 선택된 커리큘럼 번호로 보내야함
    const themeId = Math.floor(Math.random() * 10) + 1;

    const response = await axios.get(`https://i9e206.p.ssafy.io/api/v1/themes/8`);
    const wordsList = response.data.data.wordList; // 응답 값에서 themes 추출

    dispatch({
      type: FETCH_WORDSLIST_SUCCESS,
      payload: wordsList,
    });
  } catch (error) {
    // 오류 처리를 원한다면 여기서 핸들링
    console.error('Error fetching wordsList:', error);
  }
};
