export const SET_LIVE_CLASS = "SET_LIVE_CLASS";
export const setLiveClass = (clazz) => {
  return {
    type: SET_LIVE_CLASS,
    payload: clazz,
  };
};
