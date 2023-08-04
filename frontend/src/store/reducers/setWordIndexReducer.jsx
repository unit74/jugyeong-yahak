// reducers.js
import { SET_WORD_INDEX } from '../actions/types';

const initialState = {
  wordIndex:0,
  // Add other initial state properties if needed
};

const setWordIndexReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_WORD_INDEX:
      return {
        ...state,
        wordIndex: state.wordIndex + 1,
      };
    // Add other cases for different actions if needed
    default:
      return state;
  }
};

export default setWordIndexReducer;
