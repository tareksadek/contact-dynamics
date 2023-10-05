import { formatISO } from 'date-fns';
import { isFirestoreTimestamp, convertFirestoreTimestampToDate } from '../../utilities/utils'
import {
  CHECK_INVITATION_REQUEST,
  CHECK_INVITATION_SUCCESS,
  CHECK_INVITATION_FAILURE,
  UPDATE_INVITATION,
} from './actionTypes';
import { getInvitationFromBatchById } from '../../API/invitations';
import { getBatchById } from '../../API/batch';
import { setNotification } from './notificationCenter';
import { InvitationData, BatchData } from '../../types/userInvitation';

export interface CheckInvitationRequestAction {
  type: typeof CHECK_INVITATION_REQUEST;
}

export interface CheckInvitationSuccessAction {
  type: typeof CHECK_INVITATION_SUCCESS;
  invitation: InvitationData;
  batch: BatchData;
}

export interface CheckInvitationFailureAction {
  type: typeof CHECK_INVITATION_FAILURE;
  error: string;
}

export interface UpdateInvitationAction {
  type: typeof UPDATE_INVITATION;
  invitation: InvitationData;
  batch: BatchData;
}

export type UserInvitationActionTypes = 
  | CheckInvitationRequestAction
  | CheckInvitationSuccessAction 
  | CheckInvitationFailureAction 
  | UpdateInvitationAction;

// action creators:

export const checkInvitationRequest = () => ({ type: CHECK_INVITATION_REQUEST });

export const checkInvitationSuccess = (invitation: InvitationData, batch: BatchData): CheckInvitationSuccessAction => ({
  type: CHECK_INVITATION_SUCCESS,
  invitation,
  batch
});

export const checkInvitationFailure = (error: string): CheckInvitationFailureAction => ({
  type: CHECK_INVITATION_FAILURE,
  error
});

export const updateInvitation = (invitation: InvitationData, batch: BatchData): UpdateInvitationAction => ({
  type: UPDATE_INVITATION,
  invitation,
  batch
});

export const checkInvitationValidity = (batchId: string, invitationId: string) => async (dispatch: any) => {
  console.log(batchId);
  console.log(invitationId);
  
  try {
    dispatch(checkInvitationRequest());

    const batchData = await getBatchById(batchId) as BatchData;
    const invitationData = await getInvitationFromBatchById(batchId, invitationId) as InvitationData;

    // Convert Timestamps to ISO string
    if (invitationData && invitationData.expirationDate && isFirestoreTimestamp(invitationData.expirationDate)) {
      invitationData.expirationDate = formatISO(convertFirestoreTimestampToDate(invitationData.expirationDate));
    }
    
    if (batchData && batchData.createdOn && isFirestoreTimestamp(batchData.createdOn)) {
      batchData.createdOn = formatISO(convertFirestoreTimestampToDate(batchData.createdOn));
    }

    console.log(batchData);
    console.log(invitationData);
    
    
    if (batchData && invitationData) {
      invitationData.id = invitationId;
      batchData.id = batchId
      dispatch(checkInvitationSuccess(invitationData, batchData));
      if (!invitationData.used) {
        dispatch(setNotification({ message: 'Invitation validated successfully.', type: 'success', horizontal: 'right', vertical: 'top' }));
      }
    } else {
      dispatch(checkInvitationFailure('Data not found.'));
      dispatch(setNotification({ message: 'Invitation code is not valid.', type: 'error', horizontal: 'right', vertical: 'top' }));
    }
  } catch (error) {
    console.log(error);
    
    dispatch(checkInvitationFailure((error as Error).message));
  }
};
