import {
  GET_ALL_USERS_REQUEST,
  GET_ALL_USERS_SUCCESS,
  GET_ALL_USERS_FAILURE,
  FETCH_SELECTED_USER_REQUEST,
  FETCH_SELECTED_USER_SUCCESS,
  FETCH_SELECTED_USER_FAILURE,
} from '../actions/actionTypes';

import {
  UsersActionTypes,
  GetAllUsersSuccessAction,
  GetAllUsersFailureAction,
  FetchSelectedUserSuccessAction,
  FetchSelectedUserFailureAction,
} from '../actions/users';

import { UserType } from '../../types/user';

import { updateObj } from '../../utilities/utils';

const initialState: {
  users: UserType[] | null;
  selectedUser: UserType | null
  loading: boolean;
  error: string | null;
} = {
  users: null,
  selectedUser: null,
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
  loading: false,
  error: null,
});

const fetchUserFailure = (state: typeof initialState, action: FetchSelectedUserFailureAction) => updateObj(state, {
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
    default: return state;
  }
};

export default usersReducer;