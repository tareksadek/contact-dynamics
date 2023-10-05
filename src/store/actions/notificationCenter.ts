import { SET_NOTIFICATION, HIDE_NOTIFICATION } from './actionTypes';

export type SetNotificationAction = {
  type: typeof SET_NOTIFICATION;
  payload: {
    message: string;
    type: 'error' | 'success' | 'warning';
    horizontal?: 'left' | 'right' | 'center';
    vertical?: 'top' | 'bottom' | 'middle';
  };
};

export interface HideNotificationAction {
  type: typeof HIDE_NOTIFICATION;
}

export type NotificationActionTypes = SetNotificationAction | HideNotificationAction;

export const setNotification = (notificationData: SetNotificationAction['payload']): NotificationActionTypes => ({
  type: SET_NOTIFICATION,
  payload: notificationData,
});

export const hideNotification = (): HideNotificationAction => ({
  type: HIDE_NOTIFICATION
});