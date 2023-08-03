// src/store/reducers/themeReducer.js

import { FETCH_THEME_SUCCESS } from '../actions/types';

const initialState = {
  themeData: null,
  wordsList: null,
};

const themeReducer = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_THEME_SUCCESS:
      return {
        ...state,
        themeData: action.payload[0],
        wordsList: action.payload[1],
      };
    default:
      return state;
      
  }
};

export default themeReducer;
