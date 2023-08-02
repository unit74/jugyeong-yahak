// src/store/reducers/themesReducer.js

import { FETCH_ALLTHEMES_SUCCESS } from '../actions/types';

const initialState = {
  allThemes: [],
};

const allThemesReducer = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_ALLTHEMES_SUCCESS:
      return {
        ...state,
        alThemes: action.payload,
      };
    default:
      return state;
      
  }
};

export default allThemesReducer;
