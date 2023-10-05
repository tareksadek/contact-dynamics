import {
  FETCH_SETUP_REQUEST,
  FETCH_SETUP_SUCCESS,
  FETCH_SETUP_FAILURE,
  UPDATE_SETUP
} from '../actions/actionTypes'

import {
  SetupActionTypes,
  FetchSetupSuccessAction,
  FetchSetupFailureAction,
  UpdateSetupAction,
} from '../actions/setup';

import { SetupType } from '../../types/setup'

import { updateObj } from '../../utilities/utils';

const initialState: {
  setup: SetupType | null;
  loading: boolean;
  error: string | null;
} = {
  setup: null,
  loading: false,
  error: null,
};

const fetchSetupRequest = (state: typeof initialState) => updateObj(state, { loading: true });


const fetchSetupSuccess = (state: typeof initialState, action: FetchSetupSuccessAction) => updateObj(state, {
  setup: action.payload,
  loading: false,
  error: null,
});

const fetchSetupFailure = (state: typeof initialState, action: FetchSetupFailureAction) => updateObj(state, {
  loading: false,
  error: action.error
});

const updateSetup = (state: typeof initialState, action: UpdateSetupAction) => updateObj(state, {
  setup: action.payload
});

const setupReducer = (state = initialState, action: SetupActionTypes): typeof initialState => {
  switch (action.type) {
    case FETCH_SETUP_REQUEST: return fetchSetupRequest(state);
    case FETCH_SETUP_SUCCESS: return fetchSetupSuccess(state, action);
    case FETCH_SETUP_FAILURE: return fetchSetupFailure(state, action);
    case UPDATE_SETUP: return updateSetup(state, action);
    default: return state;
  }
};

export default setupReducer;