// src/store/reducers/index.js

import { combineReducers } from 'redux';
import allThemesReducer from './allThemesReducer';
import themeReducer from './themeReducer';
import wordsListReducer from './wordsListReducer';

const rootReducer = combineReducers({
  allThemesState: allThemesReducer,
  themeState : themeReducer,
  wordsListState : wordsListReducer
});

export default rootReducer;
