export const SET_SELECTED_THEME = 'SET_SELECTED_THEME';
export const setSelectedTheme = (themeId) => {
  return {
    type: SET_SELECTED_THEME,
    payload: themeId,
  };
};
