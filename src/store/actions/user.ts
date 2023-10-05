import { format } from 'date-fns';
import * as actionTypes from './actionTypes';
import { setNotification } from './notificationCenter';
import { getUserById, getUserByProfileSuffix } from '../../API/user';
import { UserType, RedirectType } from '../../types/user';
import { getProfileById } from './profile';
import { startLoading, stopLoading } from './loadingCenter';
import { redirectUserProfiles } from '../../API/user';

// Action Interfaces
interface FetchUserRequestAction {
  type: typeof actionTypes.FETCH_USER_REQUEST;
}

interface FetchUserSuccessAction {
  type: typeof actionTypes.FETCH_USER_SUCCESS;
  payload: UserType;
}

interface FetchUserFailureAction {
  type: typeof actionTypes.FETCH_USER_FAILURE;
  error: string;
}

interface UpdateUserAction {
  type: typeof actionTypes.UPDATE_USER;
  payload: UserType;
}

interface RedirectUserRequestAction {
  type: typeof actionTypes.REDIRECT_USER_REQUEST;
}

interface RedirectUserSuccessAction {
  type: typeof actionTypes.REDIRECT_USER_SUCCESS;
  payload: RedirectType;
}

interface RedirectUserFailureAction {
  type: typeof actionTypes.REDIRECT_USER_FAILURE;
  error: string;
}

interface FetchUserByProfileSuffixRequestAction {
  type: typeof actionTypes.FETCH_USER_BY_PROFILE_SUFFIX_REQUEST;
}

interface FetchUserByProfileSuffixSuccessAction {
  type: typeof actionTypes.FETCH_USER_BY_PROFILE_SUFFIX_SUCCESS;
  payload: UserType;
}

interface FetchUserByProfileSuffixFailureAction {
  type: typeof actionTypes.FETCH_USER_BY_PROFILE_SUFFIX_FAILURE;
  error: string;
}

interface AddProfileToUserAction {
  type: typeof actionTypes.ADD_PROFILE_TO_USER;
  payload: { profileId: string; profileTitle: string };
}

interface SetActiveProfileAction {
  type: typeof actionTypes.SET_ACTIVE_PROFILE;
  payload: { profileId: string; };
}

type ResponseType = {
  success: boolean;
  data?: UserType;
  error?: string;
};

export type UserActionTypes = 
  | FetchUserRequestAction
  | FetchUserSuccessAction
  | FetchUserFailureAction
  | RedirectUserRequestAction
  | RedirectUserSuccessAction
  | RedirectUserFailureAction
  | UpdateUserAction
  | FetchUserByProfileSuffixRequestAction
  | FetchUserByProfileSuffixSuccessAction
  | FetchUserByProfileSuffixFailureAction
  | AddProfileToUserAction
  | SetActiveProfileAction;

export const fetchUserRequest = (): FetchUserRequestAction => ({
  type: actionTypes.FETCH_USER_REQUEST
});

export const fetchUserSuccess = (userData: UserType): FetchUserSuccessAction => ({
  type: actionTypes.FETCH_USER_SUCCESS,
  payload: userData
});

export const fetchUserFailure = (error: string): FetchUserFailureAction => ({
  type: actionTypes.FETCH_USER_FAILURE,
  error
});

export const redirectUserRequest = (): RedirectUserRequestAction => ({
  type: actionTypes.REDIRECT_USER_REQUEST
});

export const redirectUserSuccess = (redirect: RedirectType): RedirectUserSuccessAction => ({
  type: actionTypes.REDIRECT_USER_SUCCESS,
  payload: redirect
});

export const redirectUserFailure = (error: string): RedirectUserFailureAction => ({
  type: actionTypes.REDIRECT_USER_FAILURE,
  error
});

export const addProfileToUser = (profileId: string, profileTitle: string): AddProfileToUserAction => ({
  type: actionTypes.ADD_PROFILE_TO_USER,
  payload: { profileId, profileTitle }
});

export const setActiveProfile = (profileId: string): SetActiveProfileAction => ({
  type: actionTypes.SET_ACTIVE_PROFILE,
  payload: { profileId }
});

export const fetchUser = (userId: string) => async (dispatch: any, getState: any) => {
  dispatch(startLoading('Loading user...'));
  dispatch(fetchUserRequest());
  try {
    const response: ResponseType = await getUserById(userId) as ResponseType;
    const appSetup = getState().setup.setup;

    if (response.success && response.data) {
      if (response.data?.createdOn) {
        response.data.createdOn = format(response.data.createdOn as Date, 'yyyy-MMM-dd');
      }
    
      if (response.data?.lastLogin) {
          response.data.lastLogin = format(response.data.lastLogin as Date, 'yyyy-MMM-dd');
      }

      if (appSetup.redirect) {
        response.data.redirect = appSetup.redirect
      }

      dispatch(fetchUserSuccess(response.data as UserType));

      if (response.data.activeProfileId) {
        dispatch(getProfileById(userId, response.data.activeProfileId));
      }
      dispatch(stopLoading());
    } else {
      dispatch(stopLoading());
      throw new Error(response.error || 'Failed to fetch user');
    }

  } catch (err) {
    dispatch(stopLoading());
    dispatch(fetchUserFailure((err as Error).message));
    dispatch(setNotification({ message: 'Failed to load user data', type: 'error', horizontal: 'right', vertical: 'top' }));
  }
};

export const fetchUserByProfileSuffix = (profileSuffix: string) => async (dispatch: any, getState: any) => {
  dispatch(startLoading('Loading user...'));
  dispatch({ type: actionTypes.FETCH_USER_BY_PROFILE_SUFFIX_REQUEST });
  console.log(profileSuffix);
  
  try {
    // Replace this with your API call method for fetching user by profile suffix
    const response: ResponseType = await getUserByProfileSuffix(profileSuffix) as ResponseType; 
    const appSetup = getState().setup.setup;
    
    if (response.success && response.data) {
      if (response.data?.createdOn) {
        response.data.createdOn = format(response.data.createdOn as Date, 'yyyy-MMM-dd');
      }
    
      if (response.data?.lastLogin) {
          response.data.lastLogin = format(response.data.lastLogin as Date, 'yyyy-MMM-dd');
      }
      
      if (appSetup.redirect) {
        response.data.redirect = appSetup.redirect
      }

      dispatch(fetchUserSuccess(response.data as UserType));
      
      if (response.data.activeProfileId) {
        dispatch(getProfileById(response.data.id, response.data.activeProfileId));
      }
      dispatch(stopLoading());
    } else {
      dispatch(stopLoading());
      throw new Error(response.error || 'Failed to fetch user');
    }
  } catch (err) {
    console.log(err);
    
    dispatch(stopLoading());
    dispatch({ type: actionTypes.FETCH_USER_BY_PROFILE_SUFFIX_FAILURE, error: (err as Error).message });
    dispatch(setNotification({ message: 'Failed to load user data', type: 'error', horizontal: 'right', vertical: 'top' }));
  }
};

export const redirectUser = (userId: string, redirect: RedirectType) => async (dispatch: any) => {
  dispatch(startLoading('Redirecting...'))
  dispatch(redirectUserRequest());
  
  try {
    const response = await redirectUserProfiles(userId, redirect.active, redirect.url || '');
    if (response.success) {
      dispatch(redirectUserSuccess(redirect));
      dispatch(stopLoading())
      dispatch(setNotification({ message: 'Redirected successfully', type: 'success', horizontal: 'right', vertical: 'top' }));
    } else {
      dispatch(stopLoading())
      throw new Error('Failed to redirect');
    }
  } catch (err) {
    console.log(err);
    dispatch(stopLoading())
    dispatch(redirectUserFailure((err as Error).message));
    dispatch(setNotification({ message: 'Failed to redirect', type: 'error', horizontal: 'right', vertical: 'top' }));
  }
};

// Update user
export const updateUser = (updatedUserData: UserType): UpdateUserAction => ({
  type: actionTypes.UPDATE_USER,
  payload: updatedUserData
});

export type {
  FetchUserSuccessAction,
  FetchUserFailureAction,
  UpdateUserAction,
  FetchUserByProfileSuffixSuccessAction,
  FetchUserByProfileSuffixFailureAction,
  FetchUserByProfileSuffixRequestAction,
  AddProfileToUserAction,
  SetActiveProfileAction,
  RedirectUserSuccessAction,
  RedirectUserFailureAction
};
export {};
