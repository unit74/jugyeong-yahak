// reducers.js
import { SET_SELECTED_THEME } from '../actions/types';

const initialState = {
  selectedTheme: null,
  // Add other initial state properties if needed
};

const setSelectedThemeReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_SELECTED_THEME:
      return {
        ...state,
        selectedTheme: action.payload,
      };
    // Add other cases for different actions if needed
    default:
      return state;
  }
};

export default setSelectedThemeReducer;
