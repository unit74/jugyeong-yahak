// src/store/reducers/index.js

import { combineReducers } from "redux";
import allThemesReducer from "./allThemesReducer";
import themeReducer from "./themeReducer";
import setSelectedThemeReducer from "./setSelectedThemeReducer";
import setWordIndexReducer from "./setWordIndexReducer";
import messageReducer from "./messageReducer";
import noteReducer from "./noteReducer";
import genderReducer from "./setGenderReducer";
import liveClassReducer from "./liveClassReducer";

const rootReducer = combineReducers({
  allThemesState: allThemesReducer,
  themeState: themeReducer,
  // 교사가 carousel에서 커리 선택하면 여기에 저장됨.
  liveClassState: liveClassReducer,
  selectedThemeState: setSelectedThemeReducer,
  wordIndexState: setWordIndexReducer,
  message: messageReducer,
  note: noteReducer,
  gender: genderReducer,
});

export default rootReducer;
