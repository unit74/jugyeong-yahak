// src/store/reducers/wordsReducer.js

import { FETCH_THEME_SUCCESS } from '../actions/types';

const initialState = {
  themeData: [],
};

const themeReducer = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_THEME_SUCCESS:
      return {
        ...state,
        themeData: action.payload,
      };
    default:
      return state;
      
  }
};

export default themeReducer;
