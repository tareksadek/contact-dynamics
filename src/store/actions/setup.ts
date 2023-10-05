import * as actionTypes from './actionTypes';
import { setNotification } from './notificationCenter';
import { fetchDefaultSetup } from '../../API/setup';
import { defaults } from '../../setup/setup';
import { StaticSetup, FetchedSetup, SetupType } from '../../types/setup';
import { startLoading, stopLoading } from './loadingCenter';

// Action Interfaces
interface FetchSetupRequestAction {
  type: typeof actionTypes.FETCH_SETUP_REQUEST;
}

interface FetchSetupSuccessAction {
  type: typeof actionTypes.FETCH_SETUP_SUCCESS;
  payload: SetupType;
}

interface FetchSetupFailureAction {
  type: typeof actionTypes.FETCH_SETUP_FAILURE;
  error: string;
}

interface UpdateSetupAction {
  type: typeof actionTypes.UPDATE_SETUP;
  payload: SetupType;
}

export type SetupActionTypes = FetchSetupRequestAction | FetchSetupSuccessAction | FetchSetupFailureAction | UpdateSetupAction;

// Fetching setup
export const fetchSetupRequest = (): FetchSetupRequestAction => ({
  type: actionTypes.FETCH_SETUP_REQUEST
});

export const fetchSetupSuccess = (setupData: SetupType): FetchSetupSuccessAction => ({
  type: actionTypes.FETCH_SETUP_SUCCESS,
  payload: setupData
});

export const fetchSetupFailure = (error: string): FetchSetupFailureAction => ({
  type: actionTypes.FETCH_SETUP_FAILURE,
  error
});

export const fetchSetup = () => async (dispatch: any) => {
  dispatch(startLoading('Loading setup...'));
  dispatch(fetchSetupRequest());
  try {
    const firestoreSetupData = await fetchDefaultSetup();
    const combinedSetupData: SetupType = {
      ...defaults as StaticSetup,
      ...firestoreSetupData as FetchedSetup
    };
    dispatch(fetchSetupSuccess(combinedSetupData as SetupType));
    dispatch(stopLoading());
  } catch (err) {
    dispatch(fetchSetupFailure((err as Error).message));
    dispatch(stopLoading());
    dispatch(setNotification({ message: 'Failed to load setup data', type: 'error', horizontal: 'right', vertical: 'top' }));
  }
};

// Update setup
export const updateSetup = (updatedSetupData: SetupType): UpdateSetupAction => ({
  type: actionTypes.UPDATE_SETUP,
  payload: updatedSetupData
});

export type { FetchSetupSuccessAction, FetchSetupFailureAction, UpdateSetupAction };