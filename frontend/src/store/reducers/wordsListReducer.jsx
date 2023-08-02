// src/store/reducers/wordsReducer.js

import { FETCH_WORDSLIST_SUCCESS } from '../actions/types';

const initialState = {
  wordsList: [],
};

const wordsListReducer = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_WORDSLIST_SUCCESS:
      return {
        ...state,
        wordsList: action.payload,
      };
    default:
      return state;
      
  }
};

export default wordsListReducer;
