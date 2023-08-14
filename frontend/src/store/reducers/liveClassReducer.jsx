import { SET_LIVE_CLASS } from "../actions/types";

const initialState = {};

const liveClassReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_LIVE_CLASS:
      return {
        ...state,
        clazz: action.payload,
      };
    default:
      return state;
  }
};

export default liveClassReducer;
