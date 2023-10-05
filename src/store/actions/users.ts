import { format, formatISO } from 'date-fns';
import {
  GET_ALL_USERS_REQUEST,
  GET_ALL_USERS_SUCCESS,
  GET_ALL_USERS_FAILURE,
  FETCH_SELECTED_USER_REQUEST,
  FETCH_SELECTED_USER_SUCCESS,
  FETCH_SELECTED_USER_FAILURE,
} from './actionTypes';
import { DeleteUserRequest, DeleteUserResponse } from '../../types/user';
import { functions } from '../../API/firebaseConfig';
import { httpsCallable, HttpsCallableResult } from '@firebase/functions';
import { setNotification } from './notificationCenter';
import { UserType } from '../../types/user';
import { getAllUsers, getUserById } from '../../API/user';
import { startLoading, stopLoading } from './loadingCenter';
import { AppDispatch, RootState } from '../reducers';


export interface GetAllUsersRequestAction {
  type: typeof GET_ALL_USERS_REQUEST;
}

export interface GetAllUsersSuccessAction {
  type: typeof GET_ALL_USERS_SUCCESS;
  users: UserType[];
}

export interface GetAllUsersFailureAction {
  type: typeof GET_ALL_USERS_FAILURE;
  error: string;
}

export interface FetchSelectedUserRequestAction {
  type: typeof FETCH_SELECTED_USER_REQUEST;
}

export interface FetchSelectedUserSuccessAction {
  type: typeof FETCH_SELECTED_USER_SUCCESS;
  payload: UserType;
}

export interface FetchSelectedUserFailureAction {
  type: typeof FETCH_SELECTED_USER_FAILURE;
  error: string;
}

export type UsersActionTypes = 
  | GetAllUsersRequestAction
  | GetAllUsersSuccessAction
  | GetAllUsersFailureAction
  | FetchSelectedUserRequestAction
  | FetchSelectedUserSuccessAction
  | FetchSelectedUserFailureAction;

type ResponseType = {
  success: boolean;
  data?: UserType;
  error?: string;
};

export const getAllUsersRequest = (): GetAllUsersRequestAction => ({
  type: GET_ALL_USERS_REQUEST
});

export const getAllUsersSuccess = (users: UserType[]): GetAllUsersSuccessAction => ({
  type: GET_ALL_USERS_SUCCESS,
  users
});

export const getAllUsersFailure = (error: string): GetAllUsersFailureAction => ({
  type: GET_ALL_USERS_FAILURE,
  error
});

export const fetchSelectedUserRequest = (): FetchSelectedUserRequestAction => ({
  type: FETCH_SELECTED_USER_REQUEST
});

export const fetchSelectedUserSuccess = (userData: UserType): FetchSelectedUserSuccessAction => ({
  type: FETCH_SELECTED_USER_SUCCESS,
  payload: userData
});

export const fetchUserFailure = (error: string): FetchSelectedUserFailureAction => ({
  type: FETCH_SELECTED_USER_FAILURE,
  error
});

export const getUsers = () => async (dispatch: AppDispatch) => {
  dispatch(startLoading('Loading users...'))
  dispatch(getAllUsersRequest());
  try {
    const response = await getAllUsers();
    console.log(response);
    
    if (response.success && response.data && response.data.length > 0) {      
      const users: UserType[] = response.data.map((user: UserType) => ({
        ...user,
        createdOn: format(user.createdOn as Date, 'yyyy-MMM-dd'),
        lastLogin: format(user.lastLogin as Date, 'yyyy-MMM-dd')
      }));
      
      dispatch(getAllUsersSuccess(users));
      dispatch(stopLoading())
      dispatch(setNotification({ 
        message: 'Users loaded successfully.', 
        type: 'success', 
        horizontal: 'right', 
        vertical: 'top' 
      }));
    } else {
      dispatch(stopLoading())
      dispatch(getAllUsersFailure('Failed to fetch users.'));
      dispatch(setNotification({ 
        message: 'Failed to fetch users.', 
        type: 'error', 
        horizontal: 'right', 
        vertical: 'top' 
      }));
    }
  } catch (error) {
    dispatch(stopLoading())
    dispatch(getAllUsersFailure((error as Error).message));
  }
};

export const fetchUser = (userId: string) => async (dispatch: any) => {
  dispatch(startLoading('Loading user...'));
  dispatch(fetchSelectedUserRequest());
  try {
    const response: ResponseType = await getUserById(userId) as ResponseType;

    if (response.success && response.data) {
      if (response.data?.createdOn) {
        response.data.createdOn = format(response.data.createdOn as Date, 'yyyy-MMM-dd');
      }
    
      if (response.data?.lastLogin) {
          response.data.lastLogin = format(response.data.lastLogin as Date, 'yyyy-MMM-dd');
      }
      dispatch(fetchSelectedUserSuccess(response.data as UserType));
      dispatch(stopLoading());
    } else {
      dispatch(stopLoading());
      throw new Error(response.error || 'Failed to fetch user');
    }

  } catch (err) {
    console.log(err);
    
    dispatch(stopLoading());
    dispatch(fetchUserFailure((err as Error).message));
    dispatch(setNotification({ message: 'Failed to load user data', type: 'error', horizontal: 'right', vertical: 'top' }));
  }
};
