import { getAuth, onAuthStateChanged } from '@firebase/auth';
import { ThunkAction } from 'redux-thunk';
import { RootState } from '../reducers';
import { AppActions } from '../../types/app';
import * as actionTypes from './actionTypes';
import { startLoading, stopLoading } from './loadingCenter';

export interface SetUserAction {
  type: typeof actionTypes.AUTH_USER_SET;
  userId: string;
}

interface ClearUserAction {
  type: typeof actionTypes.AUTH_USER_CLEARED;
}

export type UserActionTypes = SetUserAction | ClearUserAction;

export const setUser = (userId: string): SetUserAction => ({
  type: actionTypes.AUTH_USER_SET,
  userId,
});

export const clearUser = (): ClearUserAction => ({
  type: actionTypes.AUTH_USER_CLEARED
});


export const listenToAuthState = (): ThunkAction<void, RootState, unknown, AppActions> => {
  return (dispatch) => {
    const auth = getAuth();

    onAuthStateChanged(auth, (user) => {
      dispatch(startLoading('Loading auth user...'));
      if (user) {
        dispatch(setUser(user.uid));
      } else {
        dispatch(clearUser());
      }
      dispatch(stopLoading())
    });
  };
};