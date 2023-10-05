import { SET_NOTIFICATION, HIDE_NOTIFICATION } from '../actions/actionTypes';
import { NotificationActionTypes, SetNotificationAction } from '../actions/notificationCenter';
import { updateObj } from '../../utilities/utils';

type NotificationType = 'error' | 'success' | 'warning';

type NotificationState = {
  notification: {
    message: string;
    type: NotificationType;
    horizontal?: 'left' | 'right' | 'center';
    vertical?: 'top' | 'bottom';
  } | null;
  isOpen: boolean;
};

const initialState: NotificationState = {
  notification: null,
  isOpen: false
};

const setNotificationState = (state: typeof initialState, action: SetNotificationAction) => updateObj(state, {
  notification: {
    message: action.payload.message,
    type: action.payload.type,
    horizontal: action.payload.horizontal || 'right',
    vertical: action.payload.vertical || 'top'
  },
  isOpen: true
});

const hideNotificationState = (state: typeof initialState) => updateObj(state, {
  notification: null,
  isOpen: false
});

const notificationReducer = (state = initialState, action: NotificationActionTypes): typeof initialState => {
  switch (action.type) {
    case SET_NOTIFICATION: return setNotificationState(state, action);
    case HIDE_NOTIFICATION: return hideNotificationState(state);
    default: return state;
  }
};

export default notificationReducer;