export const SET_WORD_INDEX = 'SET_WORD_INDEX';
export const setWordIndex = (reset = false) => {
  return {
    type: SET_WORD_INDEX,
    payload: reset,
  };
};
