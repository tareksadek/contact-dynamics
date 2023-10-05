import { configureStore } from '@reduxjs/toolkit';
import thunk from 'redux-thunk';

import setupReducer from './setup';
import loadingCenter from './loadingCenter';
import notificationReducer from './notificationCenter';
import userInvitationReducer from './userInvitation';
import batchReducer from './batch';
import authReducer from './authUser';
import userReducer from './user';
import usersReducer from './users';
import profileReducer from './profile';
import contactReducer from './contact';
import modalReducer from './modal';

const rootReducer = {
  user: userReducer,
  profile: profileReducer,
  authUser: authReducer,
  setup: setupReducer,
  loadingCenter: loadingCenter,
  notificationCenter: notificationReducer,
  userInvitation: userInvitationReducer,
  batches: batchReducer,
  users: usersReducer,
  contacts: contactReducer,
  modal: modalReducer,
};

const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(thunk),
  devTools: process.env.NODE_ENV !== 'production' ? {
    trace: true,
    traceLimit: 50
  } : false,
});

export default store;
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
