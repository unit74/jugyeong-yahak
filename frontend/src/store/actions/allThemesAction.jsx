// src/store/actions/themesActions.js
// 전체 테마 조회정보
import axios from "axios";
import { FETCH_ALLTHEMES_SUCCESS } from "./types";

const BASE_HTTP_URL = process.env.REACT_APP_BASE_HTTP_URL;

export const fetchAllThemes = () => async (dispatch) => {
  try {
    const response = await axios.get(`${BASE_HTTP_URL}/themes/list`);
    const allThemes = response.data.data; // 응답 값에서 themes 추출
    dispatch({
      type: FETCH_ALLTHEMES_SUCCESS,
      payload: allThemes,
    });
  } catch (error) {
    // 오류 처리를 원한다면 여기서 핸들링
    console.error("Error fetching allThemes:", error);
  }
};
