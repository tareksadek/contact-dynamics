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
} from '../actions/actionTypes';

import {
  BatchActionTypes,
  CreateBatchSuccessAction,
  CreateBatchFailureAction,
  UpdateBatchTitleSuccessAction,
  UpdateBatchTitleFailureAction,
  ResetInvitationSuccessAction,
  ResetInvitationFailureAction,
  GetAllBatchesSuccessAction,
  GetAllBatchesFailureAction,
  GetAllInvitationsByBatchSuccessAction,
  GetAllInvitationsByBatchFailureAction,
  AddInvitationsSuccessAction,
  AddInvitationsFailureAction,
} from '../actions/batch';

import { BatchData, InvitationData } from '../../types/userInvitation';

import { updateObj } from '../../utilities/utils';

const initialState: {
  batches: BatchData[] | null;
  selectedBatch: {
    data: BatchData | null;
    invitations: InvitationData[];
  } | null;
  loading: boolean;
  error: string | null;
} = {
  batches: null,
  selectedBatch: {
    data: null,
    invitations: []
  },
  loading: false,
  error: null,
};

const createBatchRequest = (state: typeof initialState) => updateObj(state, { loading: true });

const createBatchSuccess = (state: typeof initialState, action: CreateBatchSuccessAction) => {
  let updatedBatches = state.batches || [];

  if (updatedBatches.length > 0) {
    updatedBatches = [...updatedBatches, action.batch];
  }

  return updateObj(state, {
    batches: updatedBatches,
    loading: false,
    error: null
  });
};

const createBatchFailure = (state: typeof initialState, action: CreateBatchFailureAction) => updateObj(state, {
  loading: false,
  error: action.error
});

const updateBatchTitleRequest = (state: typeof initialState) => updateObj(state, { loading: true });

const updateBatchTitleSuccess = (state: typeof initialState, action: UpdateBatchTitleSuccessAction) => {
  
  // Check if batches array exists and then find the index of the batch to be updated
  const batchIndex = state.batches ? state.batches.findIndex(batch => batch.id === action.batchId) : -1;
  
  let updatedBatches = [...(state.batches || [])];

  // If the batch to be updated is found, modify its title
  if (batchIndex !== -1) {
    const updatedBatch = {
      ...updatedBatches[batchIndex],
      title: action.newTitle
    };
    updatedBatches[batchIndex] = updatedBatch;
  }

  return updateObj(state, {
    batches: updatedBatches,
    loading: false,
    error: null
  });
};

const updateBatchTitleFailure = (state: typeof initialState, action: UpdateBatchTitleFailureAction) => updateObj(state, {
  loading: false,
  error: action.error
});

const resetInvitationRequest = (state: typeof initialState) => updateObj(state, { loading: true });

const resetInvitationSuccess = (state: typeof initialState, action: ResetInvitationSuccessAction) => {
  // If there's no list of invitations, just return the current state
  if (!state.selectedBatch || !state.selectedBatch.invitations) {
    return state;
  }

  // Clone the invitations list and find the invitation to be reset
  const updatedInvitationsList = [...state.selectedBatch.invitations];
  const invitationIndex = updatedInvitationsList.findIndex(invitation => invitation.id === action.invitationId);

  // If no matching invitation is found, just return the current state
  if (invitationIndex === -1) {
    return state;
  }

  // Reset the specific invitation
  const updatedInvitation = {
    ...updatedInvitationsList[invitationIndex],
    used: false,
    usedOn: null,
    usedBy: null,
    connected: false
  };

  // Replace the old invitation with the updated one in the invitations list
  updatedInvitationsList[invitationIndex] = updatedInvitation;

  return updateObj(state, {
    selectedBatch: {
      ...state.selectedBatch,
      invitations: updatedInvitationsList
    },
    loading: false,
    error: null
  });
};

const resetInvitationFailure = (state: typeof initialState, action: ResetInvitationFailureAction) => updateObj(state, {
  loading: false,
  error: action.error
});

const getAllBatchesRequest = (state: typeof initialState) => updateObj(state, { loading: true });

const getAllBatchesSuccess = (state: typeof initialState, action: GetAllBatchesSuccessAction) => updateObj(state, {
  batches: action.batches,
  loading: false,
  error: null
});

const getAllBatchesFailure = (state: typeof initialState, action: GetAllBatchesFailureAction) => updateObj(state, {
  loading: false,
  error: action.error
});

const getAllInvitationsByBatchRequest = (state: typeof initialState) => updateObj(state, { loading: true });

const getAllInvitationsByBatchSuccess = (state: typeof initialState, action: GetAllInvitationsByBatchSuccessAction) => {
  return updateObj(state, {
    selectedBatch: {
      invitations: action.invitations,
      data: action.selectedBatch
    },
    loading: false,
    error: null
  });
};

const getAllInvitationsByBatchFailure = (state: typeof initialState, action: GetAllInvitationsByBatchFailureAction) => updateObj(state, {
  loading: false,
  error: action.error
});

const addInvitationsRequest = (state: typeof initialState) => updateObj(state, { loading: true });

const addInvitationsSuccess = (state: typeof initialState, action: AddInvitationsSuccessAction) => {
  const updatedInvitationsList = state.selectedBatch ? [...state.selectedBatch.invitations, ...action.invitations] : action.invitations;

  return updateObj(state, {
    selectedBatch: {
      ...state.selectedBatch,
      invitations: updatedInvitationsList
    },
    loading: false,
    error: null
  });
};

const addInvitationsFailure = (state: typeof initialState, action: AddInvitationsFailureAction) => updateObj(state, {
  loading: false,
  error: action.error
});


const batchReducer = (state = initialState, action: BatchActionTypes): typeof initialState => {
  switch (action.type) {
    case CREATE_BATCH_REQUEST: return createBatchRequest(state);
    case CREATE_BATCH_SUCCESS: return createBatchSuccess(state, action);
    case CREATE_BATCH_FAILURE: return createBatchFailure(state, action);
    case UPDATE_BATCH_TITLE_REQUEST: return updateBatchTitleRequest(state);
    case UPDATE_BATCH_TITLE_SUCCESS: return updateBatchTitleSuccess(state, action);
    case UPDATE_BATCH_TITLE_FAILURE: return updateBatchTitleFailure(state, action);
    case RESET_INVITATION_REQUEST: return resetInvitationRequest(state);
    case RESET_INVITATION_SUCCESS: return resetInvitationSuccess(state, action);
    case RESET_INVITATION_FAILURE: return resetInvitationFailure(state, action);
    case GET_ALL_BATCHES_REQUEST: return getAllBatchesRequest(state);
    case GET_ALL_BATCHES_SUCCESS: return getAllBatchesSuccess(state, action);
    case GET_ALL_BATCHES_FAILURE: return getAllBatchesFailure(state, action);
    case GET_ALL_INVITATIONS_BY_BATCH_REQUEST: return getAllInvitationsByBatchRequest(state);
    case GET_ALL_INVITATIONS_BY_BATCH_SUCCESS: return getAllInvitationsByBatchSuccess(state, action);
    case GET_ALL_INVITATIONS_BY_BATCH_FAILURE: return getAllInvitationsByBatchFailure(state, action);
    case ADD_INVITATIONS_REQUEST: return addInvitationsRequest(state);
    case ADD_INVITATIONS_SUCCESS: return addInvitationsSuccess(state, action);
    case ADD_INVITATIONS_FAILURE: return addInvitationsFailure(state, action);
    default: return state;
  }
};

export default batchReducer;