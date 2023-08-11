export const SET_SELECTED_THEME = "SET_SELECTED_THEME";
export const setSelectedTheme = (themeName) => {
  return {
    type: SET_SELECTED_THEME,
    payload: themeName,
  };
};
