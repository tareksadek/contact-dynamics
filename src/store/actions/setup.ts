import * as actionTypes from './actionTypes';
import { fetchDefaultSetup } from '../../API/setup';
import { defaults } from '../../setup/setup';

// Define Setup Data Type
export interface StaticSetup {
  withInvitations: boolean;
  withMultipleProfiles: boolean;
  withSubscription: boolean;
  trialPeriod: null | number;
  withTeams: boolean;
  withPrivacyKey: boolean;
  withImpact: boolean;
  withRewards: boolean;
}

export interface FetchedSetup {
  crmExports: Array<object>;
  embedForms: Array<object>;
  rewardsMilestones: Array<object>;
  socialPlatforms: Array<object>;
  themeDefaults: {
    color: string;
    theme: string;
    layout: string;
  };
}

export type SetupData = StaticSetup & FetchedSetup;

// Action Interfaces
interface FetchSetupRequestAction {
  type: typeof actionTypes.FETCH_SETUP_REQUEST;
}

interface FetchSetupSuccessAction {
  type: typeof actionTypes.FETCH_SETUP_SUCCESS;
  payload: SetupData;
}

interface FetchSetupFailureAction {
  type: typeof actionTypes.FETCH_SETUP_FAILURE;
  error: string;
}

interface UpdateSetupAction {
  type: typeof actionTypes.UPDATE_SETUP;
  payload: SetupData;
}

export type SetupActionTypes = FetchSetupRequestAction | FetchSetupSuccessAction | FetchSetupFailureAction | UpdateSetupAction;

// Fetching setup
export const fetchSetupRequest = (): FetchSetupRequestAction => ({
  type: actionTypes.FETCH_SETUP_REQUEST
});

export const fetchSetupSuccess = (setupData: SetupData): FetchSetupSuccessAction => ({
  type: actionTypes.FETCH_SETUP_SUCCESS,
  payload: setupData
});

export const fetchSetupFailure = (error: string): FetchSetupFailureAction => ({
  type: actionTypes.FETCH_SETUP_FAILURE,
  error
});

export const fetchSetup = () => async (dispatch: any) => {
  dispatch(fetchSetupRequest());
  try {
    const firestoreSetupData = await fetchDefaultSetup();
    const combinedSetupData: SetupData = {
      ...defaults as StaticSetup,
      ...firestoreSetupData as FetchedSetup
    };
    dispatch(fetchSetupSuccess(combinedSetupData as SetupData));
  } catch (err) {
    dispatch(fetchSetupFailure((err as Error).message));
  }
};

// Update setup
export const updateSetup = (updatedSetupData: SetupData): UpdateSetupAction => ({
  type: actionTypes.UPDATE_SETUP,
  payload: updatedSetupData
});

export type { FetchSetupSuccessAction, FetchSetupFailureAction, UpdateSetupAction };