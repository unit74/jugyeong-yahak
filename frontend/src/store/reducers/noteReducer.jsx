import { SET_NOTE } from "../actions/types";

const initialState = false;

const noteReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_NOTE:
      return action.payload;
    default:
      return state;
  }
};

export default noteReducer;
