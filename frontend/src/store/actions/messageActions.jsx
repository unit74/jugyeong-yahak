import { SET_MESSAGE } from "./types";

export const setMessage = (message) => {
  return {
    type: SET_MESSAGE,
    payload: message,
  };
};
