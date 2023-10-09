import {
  GET_ALL_USERS_REQUEST,
  GET_ALL_USERS_SUCCESS,
  GET_ALL_USERS_FAILURE,
  FETCH_SELECTED_USER_REQUEST,
  FETCH_SELECTED_USER_SUCCESS,
  FETCH_SELECTED_USER_FAILURE,
  FETCH_USER_CONTACTS_REQUEST,
  FETCH_USER_CONTACTS_SUCCESS,
  FETCH_USER_CONTACTS_FAILURE,
  FETCH_USER_PROFILE_REQUEST,
  FETCH_USER_PROFILE_SUCCESS,
  FETCH_USER_PROFILE_FAILURE,
} from '../actions/actionTypes';

import {
  UsersActionTypes,
  GetAllUsersSuccessAction,
  GetAllUsersFailureAction,
  FetchSelectedUserSuccessAction,
  FetchSelectedUserFailureAction,
  FetchUserContactsFailureAction,
  FetchUserContactsSuccessAction,
  FetchUserProfileSuccessAction,
  FetchUserProfileFailureAction, 
} from '../actions/users';

import { UserType } from '../../types/user';
import { ProfileDataType } from '../../types/profile';
import { updateObj } from '../../utilities/utils';

const initialState: {
  users: UserType[] | null;
  selectedUser: UserType | null;
  selectedUserProfile: ProfileDataType | null;
  contactsLoaded: boolean;
  loading: boolean;
  error: string | null;
} = {
  users: null,
  selectedUser: null,
  selectedUserProfile: null,
  contactsLoaded: false,
  loading: false,
  error: null,
};

const getAllUsersRequest = (state: typeof initialState) => updateObj(state, { loading: true });

const getAllUsersSuccess = (state: typeof initialState, action: GetAllUsersSuccessAction) => updateObj(state, {
  users: action.users,
  loading: false,
  error: null
});

const getAllUsersFailure = (state: typeof initialState, action: GetAllUsersFailureAction) => updateObj(state, {
  loading: false,
  error: action.error
});

const fetchSelectedUserRequest = (state: typeof initialState) => updateObj(state, { loading: true });

const fetchSelectedUserSuccess = (state: typeof initialState, action: FetchSelectedUserSuccessAction) => updateObj(state, {
  selectedUser: action.payload,
  contactsLoaded: false,
  loading: false,
  error: null,
});

const fetchUserFailure = (state: typeof initialState, action: FetchSelectedUserFailureAction) => updateObj(state, {
  loading: false,
  error: action.error
});

const fetchSelectedUserProfileRequest = (state: typeof initialState) => updateObj(state, { loading: true });

const fetchSelectedUserProfileSuccess = (state: typeof initialState, action: FetchUserProfileSuccessAction) => updateObj(state, {
  selectedUserProfile: action.payload,
  loading: false,
  error: null,
});

const fetchSelectedUserProfileFailure = (state: typeof initialState, action: FetchUserProfileFailureAction) => updateObj(state, {
  loading: false,
  error: action.error
});

const fetchUserContactsRequest = (state: typeof initialState) => updateObj(state, { loading: true });

const fetchUserContactsSuccess = (state: typeof initialState, action: FetchUserContactsSuccessAction) => {
  if (state.selectedUser) {
    return {
      ...state,
      selectedUser: {
        ...state.selectedUser,
        contacts: action.payload.contacts,
      },
      contactsLoaded: true,
      loading: false,
      error: null
    };
  }
  return state;
};

const fetchUserContactsFailure = (state: typeof initialState, action: FetchUserContactsFailureAction) => updateObj(state, {
  contactsLoaded: false,
  loading: false,
  error: action.error
});

const usersReducer = (state = initialState, action: UsersActionTypes): typeof initialState => {
  switch (action.type) {
    case GET_ALL_USERS_REQUEST: return getAllUsersRequest(state);
    case GET_ALL_USERS_SUCCESS: return getAllUsersSuccess(state, action);
    case GET_ALL_USERS_FAILURE: return getAllUsersFailure(state, action);
    case FETCH_SELECTED_USER_REQUEST: return fetchSelectedUserRequest(state);
    case FETCH_SELECTED_USER_SUCCESS: return fetchSelectedUserSuccess(state, action);
    case FETCH_SELECTED_USER_FAILURE: return fetchUserFailure(state, action);
    case FETCH_USER_CONTACTS_REQUEST: return fetchUserContactsRequest(state);
    case FETCH_USER_CONTACTS_SUCCESS: return fetchUserContactsSuccess(state, action);
    case FETCH_USER_CONTACTS_FAILURE: return fetchUserContactsFailure(state, action);
    case FETCH_USER_PROFILE_REQUEST: return fetchSelectedUserProfileRequest(state);
    case FETCH_USER_PROFILE_SUCCESS: return fetchSelectedUserProfileSuccess(state, action);
    case FETCH_USER_PROFILE_FAILURE: return fetchSelectedUserProfileFailure(state, action);
    default: return state;
  }
};

export default usersReducer;