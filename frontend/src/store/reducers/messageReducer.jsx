import { SET_MESSAGE } from "../actions/types";

const initialState = "이동규 천재";

const messageReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_MESSAGE:
      return action.payload;
    default:
      return state;
  }
};

export default messageReducer;
