// reducers.js
import { SET_WORD_INDEX } from '../actions/types';

const initialState = {
  wordIndex:0,
  // Add other initial state properties if needed
};
// reducers.js
const setWordIndexReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_WORD_INDEX:
      if (action.payload) {
        return {
          ...state,
          wordIndex: 0,
        };
      } else {
        return {
          ...state,
          wordIndex: state.wordIndex + 1,
        };
      };
    default:
      return state;
  }
};


export default setWordIndexReducer;
