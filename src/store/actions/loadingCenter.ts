import { START_LOADING, STOP_LOADING } from './actionTypes';

export type StartLoadingAction = {
  type: typeof START_LOADING;
  payload: string;
};

export type StopLoadingAction = {
  type: typeof STOP_LOADING;
};

export type LoadingActionTypes = StartLoadingAction | StopLoadingAction;

export const startLoading = (message: string): StartLoadingAction => ({
  type: START_LOADING,
  payload: message
});

export const stopLoading = (): StopLoadingAction => ({
  type: STOP_LOADING
});
