import { format, formatISO } from 'date-fns';
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
} from './actionTypes';
import { setNotification } from './notificationCenter';
import { UserType } from '../../types/user';
import { getAllUsers, getUserById } from '../../API/user';
import { startLoading, stopLoading } from './loadingCenter';
import { AppDispatch } from '../reducers';
import { ContactType } from '../../types/contact';
import { getAllProfileContacts } from '../../API/contact';
import { fetchProfileById } from '../../API/profile';
import { ProfileDataType } from '../../types/profile';


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

export interface FetchUserContactsRequestAction {
  type: typeof FETCH_USER_CONTACTS_REQUEST;
}

export interface FetchUserContactsSuccessAction {
  type: typeof FETCH_USER_CONTACTS_SUCCESS;
  payload: {
    contacts: ContactType[];
    profileId: string;
  }
}

export interface FetchUserContactsFailureAction {
  type: typeof FETCH_USER_CONTACTS_FAILURE;
  error: string;
}

export interface FetchUserProfileRequestAction {
  type: typeof FETCH_USER_PROFILE_REQUEST;
}

export interface FetchUserProfileSuccessAction {
  type: typeof FETCH_USER_PROFILE_SUCCESS;
  payload: ProfileDataType;
}

export interface FetchUserProfileFailureAction {
  type: typeof FETCH_USER_PROFILE_FAILURE;
  error: string;
}

export type UsersActionTypes = 
  | GetAllUsersRequestAction
  | GetAllUsersSuccessAction
  | GetAllUsersFailureAction
  | FetchSelectedUserRequestAction
  | FetchSelectedUserSuccessAction
  | FetchSelectedUserFailureAction
  | FetchUserContactsRequestAction
  | FetchUserContactsSuccessAction
  | FetchUserContactsFailureAction
  | FetchUserProfileRequestAction
  | FetchUserProfileSuccessAction
  | FetchUserProfileFailureAction;

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

export const fetchUserContactsRequest = (): FetchUserContactsRequestAction => ({
  type: FETCH_USER_CONTACTS_REQUEST
});

export const fetchUserContactsSuccess = (contacts: ContactType[], profileId: string): FetchUserContactsSuccessAction => ({
  type: FETCH_USER_CONTACTS_SUCCESS,
  payload: {
    contacts,
    profileId
  }
});

export const fetchUserContactsFailure = (error: string): FetchUserContactsFailureAction => ({
  type: FETCH_USER_CONTACTS_FAILURE,
  error
});

export const fetchUserProfileRequest = (): FetchUserProfileRequestAction => ({
  type: FETCH_USER_PROFILE_REQUEST
});

export const fetchUserProfileSuccess = (profileData: ProfileDataType): FetchUserProfileSuccessAction => ({
  type: FETCH_USER_PROFILE_SUCCESS,
  payload: profileData
});

export const fetchUserProfileFailure = (error: string): FetchUserProfileFailureAction => ({
  type: FETCH_USER_PROFILE_FAILURE,
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

export const fetchUserProfileById = (userId: string) => async (dispatch: any, getState: any) => {
  dispatch(startLoading('loading profile data...'))
  dispatch(fetchUserProfileRequest());
  
  try {
    let selectedUser = getState().users.selectedUser;
    if (!selectedUser || (selectedUser && selectedUser.id !== userId)) {
      const userResponse: ResponseType = await getUserById(userId) as ResponseType;
      if (userResponse.data?.createdOn) {
        userResponse.data.createdOn = format(userResponse.data.createdOn as Date, 'yyyy-MMM-dd');
      }
    
      if (userResponse.data?.lastLogin) {
          userResponse.data.lastLogin = format(userResponse.data.lastLogin as Date, 'yyyy-MMM-dd');
      }
      dispatch(fetchSelectedUserSuccess(userResponse.data as UserType));
    }
    
    const activeProfileId = getState().users.selectedUser.activeProfileId

    console.log(activeProfileId);
    

    if (activeProfileId) {
      const response = await fetchProfileById(userId, activeProfileId); 

      if (response.success) {
        response.data.id = activeProfileId
        response.data.userId = userId
        if (response.data?.createdOn) {
          const jsDateCreatedOn = (response.data.createdOn as any).toDate();
          response.data.createdOn = formatISO(jsDateCreatedOn);
        }
        const profileData = response.data
        dispatch(fetchUserProfileSuccess(profileData));
        dispatch(stopLoading())
        dispatch(setNotification({ message: 'Profile fetched successfully', type: 'success', horizontal: 'right', vertical: 'top' }));
      } else {
        dispatch(stopLoading())
        throw new Error('Failed to fetch profile');
      }
    }
  } catch (err) {
    console.log(err);
    dispatch(stopLoading())
    dispatch(fetchUserProfileFailure((err as Error).message));
    dispatch(setNotification({ message: 'Failed to fetch profile', type: 'error', horizontal: 'right', vertical: 'top' }));
  }
};

export const fetchUserContacts = (userId: string) => async (dispatch: AppDispatch, getState: any) => {
  dispatch(startLoading('Loading contact...'));
  dispatch(fetchUserContactsRequest());

  try {
    let selectedUser = getState().users.selectedUser;
    if (!selectedUser || (selectedUser && selectedUser.id !== userId)) {
      const userResponse: ResponseType = await getUserById(userId) as ResponseType;
      if (userResponse.data?.createdOn) {
        userResponse.data.createdOn = format(userResponse.data.createdOn as Date, 'yyyy-MMM-dd');
      }
    
      if (userResponse.data?.lastLogin) {
          userResponse.data.lastLogin = format(userResponse.data.lastLogin as Date, 'yyyy-MMM-dd');
      }
      dispatch(fetchSelectedUserSuccess(userResponse.data as UserType));
    }
    
    const activeProfileId = getState().users.selectedUser.activeProfileId

    if (activeProfileId) {
      const response = await getAllProfileContacts(userId, activeProfileId);
      console.log(response);
      
      if (response.success && response.data && response.data.length > 0) {
        const contacts: ContactType[] = response.data.map((contact: ContactType) => ({
          ...contact,
          createdOn: format(contact.createdOn as Date, 'yyyy-MMM-dd'),
        }));
        dispatch(fetchUserContactsSuccess(contacts, activeProfileId));
        dispatch(stopLoading())
        dispatch(setNotification({ message: 'Contacts fetched successfully', type: 'success', horizontal: 'right', vertical: 'top' }));
      } else {
        dispatch(stopLoading())
        dispatch(fetchUserContactsFailure(response.error!));
        dispatch(setNotification({ message: 'Failed to fetch contacts', type: 'error', horizontal: 'right', vertical: 'top' }));
      }
    }
    
  } catch (error) {
    console.log(error);
    
    dispatch(stopLoading())
    dispatch(fetchUserContactsFailure((error as Error).message));
    dispatch(setNotification({ message: 'Failed to fetch contacts', type: 'error', horizontal: 'right', vertical: 'top' }));
  }
};
