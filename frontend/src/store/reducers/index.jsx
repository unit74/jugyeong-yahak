// src/store/reducers/index.js

import { combineReducers } from 'redux';
import allThemesReducer from './allThemesReducer';
import themeReducer from './themeReducer';
import setSelectedThemeReducer from './setSelectedThemeReducer';
import setWordIndexReducer from './setWordIndexReducer';


const rootReducer = combineReducers({
  allThemesState: allThemesReducer,
  themeState : themeReducer,
  // 교사가 carousel에서 커리 선택하면 여기에 저장됨.
  selectedThemeState : setSelectedThemeReducer,
  wordIndexState : setWordIndexReducer
});

export default rootReducer;
