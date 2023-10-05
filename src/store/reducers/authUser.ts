import {
  AUTH_USER_SET,
  AUTH_USER_CLEARED,
} from '../actions/actionTypes';

import { updateObj } from '../../utilities/utils';

import { UserActionTypes, SetUserAction } from '../actions/authUser';

const initialState: {
  isLoggedIn: boolean;
  isLoading: boolean;
  userId: string | null,
} = {
  isLoggedIn: false,
  isLoading: true,
  userId: null,
};

const isSetUserAction = (action: UserActionTypes): action is SetUserAction => {
  return action.type === AUTH_USER_SET;
}

const setUser = (state: typeof initialState, action: SetUserAction) => updateObj(state, {
  isLoggedIn: true,
  isLoading: false,
  userId: action.userId,
});

const clearUser = (state: typeof initialState) => updateObj(state, {
  isLoggedIn: false,
  isLoading: false,
  userId: null,
});

const authReducer = (state = initialState, action: UserActionTypes): typeof initialState => {
  if (isSetUserAction(action)) {
    return setUser(state, action);
  }
  switch (action.type) {
    case AUTH_USER_CLEARED:
      return clearUser(state);
    default:
      return state;
  }
};

export default authReducer;
