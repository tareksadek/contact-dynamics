import { SetupActionTypes } from '../store/actions/setup';
import { UserInvitationActionTypes } from '../store/actions/userInvitation';
import { NotificationActionTypes } from '../store/actions/notificationCenter';
import { UserActionTypes } from '../store/actions/authUser';
import { StartLoadingAction, StopLoadingAction } from '../store/actions/loadingCenter';

export type AppActions = 
  | SetupActionTypes 
  | UserInvitationActionTypes 
  | NotificationActionTypes 
  | UserActionTypes
  | StartLoadingAction
  | StopLoadingAction;
