import { Action } from 'redux';
import { ThunkAction, ThunkDispatch } from 'redux-thunk';
import { RootState } from '../reducers';
import { SetupActionTypes } from './setup'; // Ensure you have imported the action types

export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;

export type AppDispatch = ThunkDispatch<RootState, unknown, SetupActionTypes>;

