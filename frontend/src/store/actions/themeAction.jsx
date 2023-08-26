// 개별 테마 상세 정보
import axios from "axios";
import { FETCH_THEME_SUCCESS } from "./types";

const BASE_HTTP_URL = process.env.REACT_APP_BASE_HTTP_URL;

export const fetchTheme = () => async (dispatch) => {
  try {
    const response = await axios.get(`${BASE_HTTP_URL}/themes/review`);

    const themeData = response.data.data; // 테마정보
    const wordsList = response.data.data.wordList; // 단어 5개 정

    dispatch({
      type: FETCH_THEME_SUCCESS,
      payload: { themeData, wordsList },
    });
  } catch (error) {
    // 오류 처리를 원한다면 여기서 핸들링
    console.error("Error fetching themeData:", error);
  }
};
