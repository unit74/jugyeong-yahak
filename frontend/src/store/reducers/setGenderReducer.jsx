import { SET_GENDER } from "../actions/types";

const initialState = 1;

const genderReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_GENDER:
      return action.payload;
    default:
      return state;
  }
};

export default genderReducer;
