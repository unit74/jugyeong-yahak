import { SET_GENDER } from "./types";

export const setGender = (payload) => {
  return {
    type: SET_GENDER,
    payload: payload,
  };
};
