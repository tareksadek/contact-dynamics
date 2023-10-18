import { format } from 'date-fns';
import {
  CREATE_BATCH_REQUEST,
  CREATE_BATCH_SUCCESS,
  CREATE_BATCH_FAILURE,
  UPDATE_BATCH_TITLE_REQUEST,
  UPDATE_BATCH_TITLE_SUCCESS,
  UPDATE_BATCH_TITLE_FAILURE,
  RESET_INVITATION_REQUEST,
  RESET_INVITATION_SUCCESS,
  RESET_INVITATION_FAILURE,
  GET_ALL_BATCHES_REQUEST,
  GET_ALL_BATCHES_SUCCESS,
  GET_ALL_BATCHES_FAILURE,
  GET_ALL_INVITATIONS_BY_BATCH_REQUEST,
  GET_ALL_INVITATIONS_BY_BATCH_SUCCESS,
  GET_ALL_INVITATIONS_BY_BATCH_FAILURE,
  ADD_INVITATIONS_REQUEST,
  ADD_INVITATIONS_SUCCESS,
  ADD_INVITATIONS_FAILURE,
  DELETE_BATCH_REQUEST,
  DELETE_BATCH_SUCCESS,
  DELETE_BATCH_FAILURE,
} from './actionTypes';
import { DeleteUserRequest, DeleteUserResponse } from '../../types/user';
import { functions } from '../../API/firebaseConfig';
import { httpsCallable, HttpsCallableResult } from '@firebase/functions';
import { setNotification } from './notificationCenter';
import { InvitationData, BatchData } from '../../types/userInvitation';
import { createBatchWithInvitations, updateBatchTitleData, getAllBatches, getBatchById, deleteBatchById, checkInvitationsUsed } from '../../API/batch';
import { getInvitationFromBatchById, resetInvitationData, getAllInvitationsByBatchId, createInvitations } from '../../API/invitations';
import { startLoading, stopLoading } from './loadingCenter';
import { AppDispatch, RootState } from '../reducers';

export interface CreateBatchRequestAction {
  type: typeof CREATE_BATCH_REQUEST;
}

export interface CreateBatchSuccessAction {
  type: typeof CREATE_BATCH_SUCCESS;
  batch: BatchData;
}

export interface CreateBatchFailureAction {
  type: typeof CREATE_BATCH_FAILURE;
  error: string;
}

export interface UpdateBatchTitleRequestAction {
  type: typeof UPDATE_BATCH_TITLE_REQUEST;
}

export interface UpdateBatchTitleSuccessAction {
  type: typeof UPDATE_BATCH_TITLE_SUCCESS;
  batchId: string;
  newTitle: string;
}

export interface UpdateBatchTitleFailureAction {
  type: typeof UPDATE_BATCH_TITLE_FAILURE;
  error: string;
}

export interface ResetInvitationRequestAction {
  type: typeof RESET_INVITATION_REQUEST;
}

export interface ResetInvitationSuccessAction {
  type: typeof RESET_INVITATION_SUCCESS;
  batchId: string;
  invitationId: string;
}

export interface ResetInvitationFailureAction {
  type: typeof RESET_INVITATION_FAILURE;
  error: string;
}

export interface GetAllBatchesRequestAction {
  type: typeof GET_ALL_BATCHES_REQUEST;
}

export interface GetAllBatchesSuccessAction {
  type: typeof GET_ALL_BATCHES_SUCCESS;
  batches: BatchData[];
}

export interface GetAllBatchesFailureAction {
  type: typeof GET_ALL_BATCHES_FAILURE;
  error: string;
}

export interface GetAllInvitationsByBatchRequestAction {
  type: typeof GET_ALL_INVITATIONS_BY_BATCH_REQUEST;
}

export interface GetAllInvitationsByBatchSuccessAction {
  type: typeof GET_ALL_INVITATIONS_BY_BATCH_SUCCESS;
  selectedBatch: BatchData;
  invitations: InvitationData[];
}

export interface GetAllInvitationsByBatchFailureAction {
  type: typeof GET_ALL_INVITATIONS_BY_BATCH_FAILURE;
  error: string;
}

export interface AddInvitationsRequestAction {
  type: typeof ADD_INVITATIONS_REQUEST;
}

export interface AddInvitationsSuccessAction {
  type: typeof ADD_INVITATIONS_SUCCESS;
  invitations: InvitationData[];
}

export interface AddInvitationsFailureAction {
  type: typeof ADD_INVITATIONS_FAILURE;
  error: string;
}

export interface DeleteBatchRequestAction {
  type: typeof DELETE_BATCH_REQUEST;
}

export interface DeleteBatchSuccessAction {
  type: typeof DELETE_BATCH_SUCCESS;
  batchId: string;
}

export interface DeleteBatchFailureAction {
  type: typeof DELETE_BATCH_FAILURE;
  error: string;
}

export type BatchActionTypes = 
  | CreateBatchRequestAction
  | CreateBatchSuccessAction
  | CreateBatchFailureAction
  | UpdateBatchTitleRequestAction
  | UpdateBatchTitleSuccessAction
  | UpdateBatchTitleFailureAction
  | ResetInvitationRequestAction
  | ResetInvitationSuccessAction
  | ResetInvitationFailureAction
  | GetAllBatchesRequestAction
  | GetAllBatchesSuccessAction
  | GetAllBatchesFailureAction
  | GetAllInvitationsByBatchRequestAction
  | GetAllInvitationsByBatchSuccessAction
  | GetAllInvitationsByBatchFailureAction
  | AddInvitationsRequestAction
  | AddInvitationsSuccessAction
  | AddInvitationsFailureAction
  | DeleteBatchRequestAction
  | DeleteBatchSuccessAction
  | DeleteBatchFailureAction;

export const createBatchRequest = () => ({ type: CREATE_BATCH_REQUEST });

export const createBatchSuccess = (batch: BatchData): { type: string, batch: BatchData } => ({
    type: CREATE_BATCH_SUCCESS,
    batch
});

export const createBatchFailure = (error: string): { type: string, error: string } => ({
    type: CREATE_BATCH_FAILURE,
    error
});

export const updateBatchTitleRequest = (): UpdateBatchTitleRequestAction => ({
  type: UPDATE_BATCH_TITLE_REQUEST
});

export const updateBatchTitleSuccess = (batchId: string, newTitle: string): UpdateBatchTitleSuccessAction => ({
  type: UPDATE_BATCH_TITLE_SUCCESS,
  batchId,
  newTitle
});

export const updateBatchTitleFailure = (error: string): UpdateBatchTitleFailureAction => ({
  type: UPDATE_BATCH_TITLE_FAILURE,
  error
});

export const deleteBatchRequest = (): DeleteBatchRequestAction => ({
  type: DELETE_BATCH_REQUEST
});

export const deleteBatchSuccess = (batchId: string): DeleteBatchSuccessAction => ({
  type: DELETE_BATCH_SUCCESS,
  batchId
});

export const deleteBatchFailure = (error: string): DeleteBatchFailureAction => ({
  type: DELETE_BATCH_FAILURE,
  error
});

export const getAllBatchesRequest = (): GetAllBatchesRequestAction => ({
  type: GET_ALL_BATCHES_REQUEST
});

export const getAllBatchesSuccess = (batches: BatchData[]): GetAllBatchesSuccessAction => ({
  type: GET_ALL_BATCHES_SUCCESS,
  batches
});

export const getAllBatchesFailure = (error: string): GetAllBatchesFailureAction => ({
  type: GET_ALL_BATCHES_FAILURE,
  error
});

export const getAllInvitationsByBatchRequest = (): GetAllInvitationsByBatchRequestAction => ({
  type: GET_ALL_INVITATIONS_BY_BATCH_REQUEST
});

export const getAllInvitationsByBatchSuccess = (selectedBatch: BatchData, invitations: InvitationData[]): GetAllInvitationsByBatchSuccessAction => ({
  type: GET_ALL_INVITATIONS_BY_BATCH_SUCCESS,
  selectedBatch,
  invitations
});

export const getAllInvitationsByBatchFailure = (error: string): GetAllInvitationsByBatchFailureAction => ({
  type: GET_ALL_INVITATIONS_BY_BATCH_FAILURE,
  error
});

export const addInvitationsRequest = (): AddInvitationsRequestAction => ({
  type: ADD_INVITATIONS_REQUEST
});

export const addInvitationsSuccess = (invitations: InvitationData[]): AddInvitationsSuccessAction => ({
  type: ADD_INVITATIONS_SUCCESS,
  invitations
});

export const addInvitationsFailure = (error: string): AddInvitationsFailureAction => ({
  type: ADD_INVITATIONS_FAILURE,
  error
});

export const resetInvitationRequest = (): ResetInvitationRequestAction => ({
  type: RESET_INVITATION_REQUEST
});

export const resetInvitationSuccess = (batchId: string, invitationId: string): ResetInvitationSuccessAction => ({
  type: RESET_INVITATION_SUCCESS,
  batchId,
  invitationId
});

export const resetInvitationFailure = (error: string): ResetInvitationFailureAction => ({
  type: RESET_INVITATION_FAILURE,
  error
});

export const createBatch = (batchData: BatchData, numberOfInvitations: number) => async (dispatch: any) => {
  dispatch(startLoading('Creating batch...'))
  dispatch(createBatchRequest());

  try {
      const returnedBatch = await createBatchWithInvitations(batchData, numberOfInvitations);

      if (returnedBatch) {
          dispatch(createBatchSuccess(returnedBatch));
          dispatch(stopLoading())
          dispatch(setNotification({ 
              message: 'Batch and Invitations created successfully.', 
              type: 'success', 
              horizontal: 'right', 
              vertical: 'top' 
          }));
      } else {
          dispatch(createBatchFailure('Error creating batch with invitations.'));
          dispatch(stopLoading())
          dispatch(setNotification({ 
              message: 'Error while creating batch and invitations.', 
              type: 'error', 
              horizontal: 'right', 
              vertical: 'top' 
          }));
      }
  } catch (error) {
      console.error("Error in createBatchWithInvitations action:", error);
      dispatch(stopLoading())
      dispatch(createBatchFailure((error as Error).message));
  }
};

export const updateBatchTitle = (
  batchId: string,
  newTitle: string
) => async (dispatch: any) => {
  dispatch(startLoading('Processing...'))
  dispatch(updateBatchTitleRequest());
  try {
    const { success, error } = await updateBatchTitleData(batchId, newTitle);
    if (success) {
      dispatch(updateBatchTitleSuccess(batchId, newTitle));
      dispatch(stopLoading())
      dispatch(setNotification({ 
        message: 'Title updated successfully.', 
        type: 'success', 
        horizontal: 'right', 
        vertical: 'top' 
      }));
    } else {
      dispatch(updateBatchTitleFailure(error || 'Failed to update batch title.'));
      dispatch(stopLoading())
      dispatch(setNotification({ 
        message: 'Error while updating title.', 
        type: 'error', 
        horizontal: 'right', 
        vertical: 'top' 
      }));
    }
  } catch (error) {
    dispatch(stopLoading())
    dispatch(updateBatchTitleFailure((error as Error).message));
    dispatch(setNotification({ 
      message: 'Error while updating title.', 
      type: 'error', 
      horizontal: 'right', 
      vertical: 'top' 
    }));
  }
};

// export const resetInvitation = (
//   batchId: string,
//   invitationId: string
// ) => async (dispatch: any) => {
//   dispatch(resetInvitationRequest());

//   try {
//     // Fetch the invitation data first to get the userId from usedBy attribute
//     const invitationData = await getInvitationFromBatchById(batchId, invitationId);
//     const userId = invitationData?.usedBy;

//     const { success, error } = await resetInvitationData(batchId, invitationId);
    
//     if (success) {
//       if (userId) {
//         // Delete the user from Firestore
//         await deleteUserDocument(userId);
//       }

//       dispatch(resetInvitationSuccess(batchId, invitationId));
//       dispatch(setNotification({ 
//         message: 'Invitation reset and user deleted successfully.', 
//         type: 'success', 
//         horizontal: 'right', 
//         vertical: 'top' 
//       }));
//     } else {
//       dispatch(resetInvitationFailure(error || 'Failed to reset the invitation and delete the user.'));
//       dispatch(setNotification({ 
//         message: 'Failed to reset the invitation and delete the user.', 
//         type: 'error', 
//         horizontal: 'right', 
//         vertical: 'top' 
//       }));
//     }
//   } catch (error) {
//     dispatch(resetInvitationFailure((error as Error).message));
//   }
// };

export const resetInvitation = (
  batchId: string,
  invitationId: string,
  userId: string,
) => async (dispatch: any) => {
  dispatch(startLoading('Processing...'))
  dispatch(resetInvitationRequest());

  try {
    if (userId) {
      // Call the Cloud Function to delete user data
      const deleteUserDataFunction = httpsCallable<DeleteUserRequest, DeleteUserResponse>(functions, 'deleteUserData');
      const result: HttpsCallableResult<DeleteUserResponse> = await deleteUserDataFunction({ userId });
      
      if (result.data.success) {
        dispatch(resetInvitationSuccess(batchId, invitationId));
        dispatch(stopLoading())
        dispatch(setNotification({ 
          message: 'Invitation reset and user data deleted successfully.', 
          type: 'success', 
          horizontal: 'right', 
          vertical: 'top' 
        }));
      } else {
        dispatch(resetInvitationFailure('Failed to reset the invitation.'));
        dispatch(stopLoading())
        dispatch(setNotification({ 
          message: 'Failed to reset the invitation.', 
          type: 'error', 
          horizontal: 'right', 
          vertical: 'top' 
        }));
      }
    }
  } catch (error) {
    dispatch(resetInvitationFailure((error as Error).message));
    dispatch(stopLoading())
    dispatch(setNotification({ 
      message: 'Failed to reset the invitation.', 
      type: 'error', 
      horizontal: 'right', 
      vertical: 'top' 
    }));
  }
};

export const getBatches = () => async (dispatch: AppDispatch) => {
  dispatch(startLoading('Loading batches...'))
  dispatch(getAllBatchesRequest());
  try {
    let batches = await getAllBatches();
    if (batches) {
      // Format the date directly
      console.log(batches);
      
      batches = batches.map(batch => ({
        ...batch,
        createdOn: format(batch.createdOn as Date, 'yyyy-MMM-dd')
      }));
      
      dispatch(getAllBatchesSuccess(batches));
      dispatch(stopLoading())
      dispatch(setNotification({ 
        message: 'Batches loaded successfully.', 
        type: 'success', 
        horizontal: 'right', 
        vertical: 'top' 
      }));
    } else {
      dispatch(stopLoading())
      dispatch(getAllBatchesFailure('Failed to fetch batches.'));
      dispatch(setNotification({ 
        message: 'Failed to fetch batches.', 
        type: 'error', 
        horizontal: 'right', 
        vertical: 'top' 
      }));
    }
  } catch (error) {
    dispatch(stopLoading())
    dispatch(getAllBatchesFailure((error as Error).message));
  }
};

export const getInvitationsByBatchId = (batchId: string) => async (dispatch: AppDispatch, getState: () => RootState) => {
  dispatch(startLoading('Loading invitations...'))
  dispatch(getAllInvitationsByBatchRequest());
  try {
    let batch: BatchData | null | undefined = getState().batches.batches?.find(batch => batch.id === batchId);
    if (!batch) {
      batch = await getBatchById(batchId) as BatchData;
      batch.createdOn = format(batch.createdOn as Date, 'yyyy-MMM-dd')
    }

    let invitations = await getAllInvitationsByBatchId(batchId);
    console.log(invitations);
    
    if (invitations) {
      invitations = invitations.map(invitation => ({
        ...invitation,
        expirationDate: format(invitation.expirationDate as Date, 'yyyy-MMM-dd'),
        usedOn: invitation.usedOn && format(invitation.usedOn as Date, 'yyyy-MMM-dd'),
      }));
      console.log(invitations);
      
      dispatch(getAllInvitationsByBatchSuccess(batch, invitations));
      dispatch(stopLoading())
      dispatch(setNotification({ 
        message: 'Invitations loaded successfully.', 
        type: 'success', 
        horizontal: 'right', 
        vertical: 'top' 
      }));
    } else {
      dispatch(stopLoading())
      dispatch(getAllInvitationsByBatchFailure('Failed to fetch invitations for this batch.'));
      dispatch(setNotification({ 
        message: 'Failed to fetch invitations for this batch.', 
        type: 'error', 
        horizontal: 'right', 
        vertical: 'top' 
      }));
    }
  } catch (error) {
    console.log(error);
    
    dispatch(stopLoading())
    dispatch(getAllInvitationsByBatchFailure((error as Error).message));
  }
};

export const addInvitations = (batch: BatchData, numberOfInvitations: number, shouldCreateMaster: boolean) => async (dispatch: AppDispatch) => {
  dispatch(addInvitationsRequest());

  try {
    let invitations = await createInvitations(batch, numberOfInvitations, shouldCreateMaster);

    if (invitations && invitations.length > 0) {
      invitations = invitations.map(invitation => ({
        ...invitation,
        expirationDate: format(invitation.expirationDate as Date, 'yyyy-MMM-dd'),
        usedOn: invitation.usedOn && format(invitation.usedOn as Date, 'yyyy-MMM-dd'),
      }));
      dispatch(addInvitationsSuccess(invitations));
      dispatch(setNotification({ 
          message: 'Invitations added successfully.', 
          type: 'success', 
          horizontal: 'right', 
          vertical: 'top' 
      }));
    } else {
      dispatch(addInvitationsFailure('Error adding invitations to batch.'));
      dispatch(setNotification({ 
          message: 'Error while adding invitations.', 
          type: 'error', 
          horizontal: 'right', 
          vertical: 'top' 
      }));
    }
  } catch (error) {
    console.error("Error in addInvitations action:", error);
    dispatch(addInvitationsFailure((error as Error).message));
    dispatch(setNotification({ 
        message: (error as Error).message, 
        type: 'error', 
        horizontal: 'right', 
        vertical: 'top' 
    }));
  }
};

export const deleteBatch = (
  batchId: string,
) => async (dispatch: any) => {
  dispatch(startLoading('Processing...'))
  dispatch(deleteBatchRequest());

  try {
    if (batchId) {
      // Call the Cloud Function to delete user data
      const isAnyInvitationUsed = await checkInvitationsUsed(batchId)

      if (isAnyInvitationUsed) {
        dispatch(setNotification({ 
          message: 'This batch can not be deleted.', 
          type: 'error', 
          horizontal: 'right', 
          vertical: 'top' 
        }));
        alert("This batch has used invitations, you need to reset any used invitations before you can delete a batch collection.")
        return
      }

      dispatch(deleteBatchSuccess(batchId));
      dispatch(stopLoading())
      dispatch(setNotification({ 
        message: 'Batch deleted successfully.', 
        type: 'success', 
        horizontal: 'right', 
        vertical: 'top' 
      }));
    }
  } catch (error) {
    dispatch(deleteBatchFailure((error as Error).message));
    dispatch(stopLoading())
    dispatch(setNotification({ 
      message: 'Failed to delete batch collection.', 
      type: 'error', 
      horizontal: 'right', 
      vertical: 'top' 
    }));
  }
};

