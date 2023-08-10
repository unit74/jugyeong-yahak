import { SET_NOTE } from "./types";

export const setNote = (payload) => {
  return {
    type: SET_NOTE,
    payload: payload,
  };
};
