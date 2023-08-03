// src/store/index.js

import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk'; // 비동기 액션을 위해 redux-thunk 사용
import rootReducer from './reducers';

const store = createStore(rootReducer, applyMiddleware(thunk));

export default store;
