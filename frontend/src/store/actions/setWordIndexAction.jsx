export const SET_WORD_INDEX = 'SET_WORD_INDEX';

export const setWordIndex = (index) => {
  return {
    type: SET_WORD_INDEX,
    payload: index,
  };
};
