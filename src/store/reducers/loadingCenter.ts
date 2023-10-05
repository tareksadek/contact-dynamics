import { START_LOADING, STOP_LOADING } from '../actions/actionTypes';
import { LoadingActionTypes } from '../actions/loadingCenter';

type LoadingState = {
  loadingCounter: number;
  loadingMessages: string[];
};

const initialState: LoadingState = {
  loadingCounter: 0,
  loadingMessages: []
};

const startLoadingState = (state: LoadingState, message: string): LoadingState => ({
  ...state,
  loadingCounter: state.loadingCounter + 1,
  loadingMessages: [...state.loadingMessages, message]
});

const stopLoadingState = (state: LoadingState): LoadingState => {
  const newMessages = [...state.loadingMessages];
  if (newMessages.length > 0) {
    newMessages.shift();
  }
  return {
    ...state,
    loadingCounter: Math.max(0, state.loadingCounter - 1),
    loadingMessages: newMessages
  };
};

const loadingReducer = (state = initialState, action: LoadingActionTypes): LoadingState => {
  switch (action.type) {
    case START_LOADING: return startLoadingState(state, action.payload);
    case STOP_LOADING: return stopLoadingState(state);
    default: return state;
  }
};

export default loadingReducer;
