import {
  CHECK_INVITATION_REQUEST,
  CHECK_INVITATION_SUCCESS,
  CHECK_INVITATION_FAILURE,
  UPDATE_INVITATION,
} from '../actions/actionTypes';

import {
  UserInvitationActionTypes,
  CheckInvitationSuccessAction,
  CheckInvitationFailureAction,
  UpdateInvitationAction,
} from '../actions/userInvitation';

import { InvitationData, BatchData } from '../../types/userInvitation';

import { updateObj } from '../../utilities/utils';

const initialState: {
  invitation: InvitationData | null;
  batch: BatchData | null;
  batches: BatchData[] | null;
  loading: boolean;
  error: string | null;
} = {
  invitation: null,
  batch: null,
  batches: null,
  loading: false,
  error: null,
};

const checkInvitationRequest = (state: typeof initialState) => updateObj(state, { loading: true });

const checkInvitationSuccess = (state: typeof initialState, action: CheckInvitationSuccessAction) => updateObj(state, {
  invitation: action.invitation,
  batch: action.batch,
  loading: false,
  error: null
});

const checkInvitationFailure = (state: typeof initialState, action: CheckInvitationFailureAction) => updateObj(state, {
  loading: false,
  error: action.error
});

const updateInvitation = (state: typeof initialState, action: UpdateInvitationAction) => updateObj(state, {
  invitation: action.invitation,
  batch: action.batch
});

const userInvitationReducer = (state = initialState, action: UserInvitationActionTypes): typeof initialState => {
  switch (action.type) {
    case CHECK_INVITATION_REQUEST: return checkInvitationRequest(state);
    case CHECK_INVITATION_SUCCESS: return checkInvitationSuccess(state, action);
    case CHECK_INVITATION_FAILURE: return checkInvitationFailure(state, action);
    case UPDATE_INVITATION: return updateInvitation(state, action);
    default: return state;
  }
};

export default userInvitationReducer;