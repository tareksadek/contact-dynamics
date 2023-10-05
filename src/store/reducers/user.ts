import {
  FETCH_USER_REQUEST,
  FETCH_USER_SUCCESS,
  FETCH_USER_FAILURE,
  UPDATE_USER,
  FETCH_USER_BY_PROFILE_SUFFIX_REQUEST,
  FETCH_USER_BY_PROFILE_SUFFIX_SUCCESS,
  FETCH_USER_BY_PROFILE_SUFFIX_FAILURE,
  ADD_PROFILE_TO_USER,
  SET_ACTIVE_PROFILE,
  REDIRECT_USER_REQUEST,
  REDIRECT_USER_SUCCESS,
  REDIRECT_USER_FAILURE
} from '../actions/actionTypes';

import {
  UserActionTypes,
  FetchUserSuccessAction,
  FetchUserFailureAction,
  UpdateUserAction,
  FetchUserByProfileSuffixSuccessAction,
  FetchUserByProfileSuffixFailureAction,
  AddProfileToUserAction,
  SetActiveProfileAction,
  RedirectUserSuccessAction,
  RedirectUserFailureAction,
} from '../actions/user';

import { UserType } from '../../types/user';
import { updateObj } from '../../utilities/utils';

const initialState: {
  user: UserType | null;
  loading: boolean;
  error: string | null;
} = {
  user: null,
  loading: false,
  error: null,
};

const fetchUserRequest = (state: typeof initialState) => updateObj(state, { loading: true });

const fetchUserSuccess = (state: typeof initialState, action: FetchUserSuccessAction) => updateObj(state, {
  user: action.payload,
  loading: false,
  error: null,
});

const fetchUserFailure = (state: typeof initialState, action: FetchUserFailureAction) => updateObj(state, {
  loading: false,
  error: action.error
});

const updateUser = (state: typeof initialState, action: UpdateUserAction) => updateObj(state, {
  user: action.payload
});

const fetchUserByProfileSuffixRequest = (state: typeof initialState) => updateObj(state, { loading: true });
const fetchUserByProfileSuffixSuccess = (state: typeof initialState, action: FetchUserByProfileSuffixSuccessAction) => updateObj(state, {
  user: action.payload,
  loading: false,
  error: null,
});
const fetchUserByProfileSuffixFailure = (state: typeof initialState, action: FetchUserByProfileSuffixFailureAction) => updateObj(state, {
  loading: false,
  error: action.error
});

const addProfileToUser = (state: typeof initialState, action: AddProfileToUserAction) => {
  if (!state.user || !state.user.profileList) return state;

  const updatedProfileList = [...state.user.profileList, {
    profileId: action.payload.profileId,
    profileTitle: action.payload.profileTitle
  }];

  const updatedUser = { ...state.user, profileList: updatedProfileList };
  
  return updateObj(state, { user: updatedUser });
};

const setActiveProfile = (state: typeof initialState, action: SetActiveProfileAction) => {
  if (!state.user) return state;

  const updatedUser = { ...state.user, activeProfileId: action.payload.profileId };
  
  return updateObj(state, { user: updatedUser });
};

const redirectUserRequest = (state: typeof initialState) => updateObj(state, { loading: true });

const redirectUser = (state: typeof initialState, action: RedirectUserSuccessAction) => {
  if (!state.user) return state;

  const updatedUser = { ...state.user, redirect: action.payload };
  
  return updateObj(state, { user: updatedUser });
};

const redirectUserFailure = (state: typeof initialState, action: RedirectUserFailureAction) => updateObj(state, {
  loading: false,
  error: action.error
});

const userReducer = (state = initialState, action: UserActionTypes): typeof initialState => {
  switch (action.type) {
    case FETCH_USER_REQUEST: return fetchUserRequest(state);
    case FETCH_USER_SUCCESS: return fetchUserSuccess(state, action);
    case FETCH_USER_FAILURE: return fetchUserFailure(state, action);
    case UPDATE_USER: return updateUser(state, action);
    case FETCH_USER_BY_PROFILE_SUFFIX_REQUEST: return fetchUserByProfileSuffixRequest(state);
    case FETCH_USER_BY_PROFILE_SUFFIX_SUCCESS: return fetchUserByProfileSuffixSuccess(state, action);
    case FETCH_USER_BY_PROFILE_SUFFIX_FAILURE: return fetchUserByProfileSuffixFailure(state, action);
    case ADD_PROFILE_TO_USER: return addProfileToUser(state, action);
    case SET_ACTIVE_PROFILE: return setActiveProfile(state, action);
    case REDIRECT_USER_REQUEST: return redirectUserRequest(state);
    case REDIRECT_USER_SUCCESS: return redirectUser(state, action);
    case REDIRECT_USER_FAILURE: return redirectUserFailure(state, action);
    default: return state;
  }
};

export default userReducer;
