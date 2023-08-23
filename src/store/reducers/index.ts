import { combineReducers } from 'redux';

import setupReducer from './setup';

const rootReducer = combineReducers({
  setup: setupReducer,
});

export default rootReducer;
export type RootState = ReturnType<typeof rootReducer>;
