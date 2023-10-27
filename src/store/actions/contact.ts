import { format } from 'date-fns';
import {
  ADD_NEW_CONTACT_REQUEST,
  ADD_NEW_CONTACT_SUCCESS,
  ADD_NEW_CONTACT_FAILURE,
  DELETE_CONTACT_REQUEST,
  DELETE_CONTACT_SUCCESS,
  DELETE_CONTACT_FAILURE,
  UPDATE_CONTACT_REQUEST,
  UPDATE_CONTACT_SUCCESS,
  UPDATE_CONTACT_FAILURE,
  FETCH_ALL_CONTACTS_REQUEST,
  FETCH_ALL_CONTACTS_SUCCESS,
  FETCH_ALL_CONTACTS_FAILURE
} from './actionTypes';

import { AppDispatch } from '../reducers';
import { ContactType } from '../../types/contact';
import { createContact, deleteContactById, editContactById, getAllProfileContacts } from '../../API/contact';
import { startLoading, stopLoading } from './loadingCenter';
import { setNotification } from './notificationCenter';

// Action Types
export interface AddNewContactRequestAction {
  type: typeof ADD_NEW_CONTACT_REQUEST;
}

export interface AddNewContactSuccessAction {
  type: typeof ADD_NEW_CONTACT_SUCCESS;
  payload: ContactType;
}

export interface AddNewContactFailureAction {
  type: typeof ADD_NEW_CONTACT_FAILURE;
  payload: string;
}

export interface DeleteContactRequestAction {
  type: typeof DELETE_CONTACT_REQUEST;
}

export interface DeleteContactSuccessAction {
  type: typeof DELETE_CONTACT_SUCCESS;
  payload: { id: string };
}

export interface DeleteContactFailureAction {
  type: typeof DELETE_CONTACT_FAILURE;
  error: string;
}

export interface UpdateContactRequestAction {
  type: typeof UPDATE_CONTACT_REQUEST;
}

export interface UpdateContactSuccessAction {
  type: typeof UPDATE_CONTACT_SUCCESS;
  payload: ContactType;
}

export interface UpdateContactFailureAction {
  type: typeof UPDATE_CONTACT_FAILURE;
  error: string;
}

export interface FetchAllContactsRequestAction {
  type: typeof FETCH_ALL_CONTACTS_REQUEST;
}

export interface FetchAllContactsSuccessAction {
  type: typeof FETCH_ALL_CONTACTS_SUCCESS;
  payload: {
    contacts: ContactType[];
    profileId: string;
  }
}

export interface FetchAllContactsFailureAction {
  type: typeof FETCH_ALL_CONTACTS_FAILURE;
  payload: string;
}

export type ContactsActionTypes = 
  | AddNewContactRequestAction
  | AddNewContactSuccessAction
  | AddNewContactFailureAction
  | DeleteContactRequestAction
  | DeleteContactSuccessAction
  | DeleteContactFailureAction
  | UpdateContactRequestAction
  | UpdateContactSuccessAction
  | UpdateContactFailureAction
  | FetchAllContactsRequestAction
  | FetchAllContactsSuccessAction
  | FetchAllContactsFailureAction;

// Action Creators
export const addNewContactRequest = (): AddNewContactRequestAction => ({
  type: ADD_NEW_CONTACT_REQUEST
});

export const addNewContactSuccess = (contact: ContactType): AddNewContactSuccessAction => ({
  type: ADD_NEW_CONTACT_SUCCESS,
  payload: contact
});

export const addNewContactFailure = (errorMsg: string): AddNewContactFailureAction => ({
  type: ADD_NEW_CONTACT_FAILURE,
  payload: errorMsg
});

export const deleteContactRequest = (): DeleteContactRequestAction => ({
  type: DELETE_CONTACT_REQUEST
});

export const deleteContactSuccess = (id: string): DeleteContactSuccessAction => ({
  type: DELETE_CONTACT_SUCCESS,
  payload: { id }
});

export const deleteContactFailure = (error: string): DeleteContactFailureAction => ({
  type: DELETE_CONTACT_FAILURE,
  error
});

export const updateContactRequest = (): UpdateContactRequestAction => ({
  type: UPDATE_CONTACT_REQUEST
});

export const updateContactSuccess = (contact: ContactType): UpdateContactSuccessAction => ({
  type: UPDATE_CONTACT_SUCCESS,
  payload: contact
});

export const updateContactFailure = (error: string): UpdateContactFailureAction => ({
  type: UPDATE_CONTACT_FAILURE,
  error
});

export const fetchAllContactsRequest = (): FetchAllContactsRequestAction => ({
  type: FETCH_ALL_CONTACTS_REQUEST
});

export const fetchAllContactsSuccess = (contacts: ContactType[], profileId: string): FetchAllContactsSuccessAction => ({
  type: FETCH_ALL_CONTACTS_SUCCESS,
  payload: {
    contacts,
    profileId
  }
});

export const fetchAllContactsFailure = (error: string): FetchAllContactsFailureAction => ({
  type: FETCH_ALL_CONTACTS_FAILURE,
  payload: error
});

export const addNewContact = (userId: string, profileId: string, contactData: ContactType) => async (dispatch: AppDispatch) => {
  // dispatch(startLoading('Adding contact...'));
  dispatch(addNewContactRequest());
  try {
    const response = await createContact(userId, profileId, contactData);
    console.log(response);
    
    if (response.success) {
      const data = response.data;
      data.createdOn = format(data.createdOn as Date, 'yyyy-MMM-dd');
      dispatch(addNewContactSuccess(data));
      // dispatch(stopLoading())
      dispatch(setNotification({ message: 'Contact added successfully', type: 'success', horizontal: 'right', vertical: 'top' }));
    } else{
      // dispatch(stopLoading())
      dispatch(addNewContactFailure(response.error));
      dispatch(setNotification({ message: 'Failed to add new contact', type: 'error', horizontal: 'right', vertical: 'top' }));
    }
  } catch (err){
    // dispatch(stopLoading())
    dispatch(addNewContactFailure((err as Error).message));
    dispatch(setNotification({ message: 'Failed to add new contact', type: 'error', horizontal: 'right', vertical: 'top' }));
  }
};

export const deleteContact = (userId: string, profileId: string, contactId: string) => async (dispatch: AppDispatch) => {
  // dispatch(startLoading('Deleting contact...'));
  dispatch(deleteContactRequest());
  try {
    await deleteContactById(userId, profileId, contactId);
    dispatch(deleteContactSuccess(contactId));
    // dispatch(stopLoading())
    dispatch(setNotification({ message: 'Contact deleted successfully', type: 'success', horizontal: 'right', vertical: 'top' }));
  } catch (error) {
    // dispatch(stopLoading())
    dispatch(deleteContactFailure((error as Error).message));
    dispatch(setNotification({ message: 'Failed to delete contact', type: 'error', horizontal: 'right', vertical: 'top' }));
  }
};

export const updateContact = (
  userId: string,
  profileId: string,
  contactId: string,
  updatedData: Partial<ContactType>
) => async (dispatch: AppDispatch) => {
  // dispatch(startLoading('Updating contact...'));
  dispatch(updateContactRequest());
  try {
    await editContactById(userId, profileId, contactId, updatedData);
    updatedData.createdOn = format(updatedData.createdOn as Date, 'yyyy-MMM-dd');
    dispatch(updateContactSuccess({ ...updatedData, id: contactId } as ContactType));
    // dispatch(stopLoading())
    dispatch(setNotification({ message: 'Contact updated successfully', type: 'success', horizontal: 'right', vertical: 'top' }));
  } catch (error) {
    // dispatch(stopLoading())
    dispatch(updateContactFailure((error as Error).message));
    dispatch(setNotification({ message: 'Failed to update contact', type: 'error', horizontal: 'right', vertical: 'top' }));
  }
};

export const fetchAllContacts = (userId: string, profileId: string) => async (dispatch: AppDispatch, getState: any) => {
  dispatch(startLoading('Loading contact...'));
  dispatch(fetchAllContactsRequest());

  try {
    const response = await getAllProfileContacts(userId, profileId);
    if (response.success && response.data && response.data.length > 0) {
      const contacts: ContactType[] = response.data.map((contact: ContactType) => ({
        ...contact,
        createdOn: format(contact.createdOn as Date, 'yyyy-MMM-dd'),
      }));
      const profile = getState().profile.profile;
      dispatch(fetchAllContactsSuccess(contacts, profile.id));
      dispatch(stopLoading())
      dispatch(setNotification({ message: 'Contacts fetched successfully', type: 'success', horizontal: 'right', vertical: 'top' }));
    } else {
      dispatch(stopLoading())
      dispatch(fetchAllContactsFailure(response.error!));
      dispatch(setNotification({ message: 'Failed to fetch contacts', type: 'error', horizontal: 'right', vertical: 'top' }));
    }
  } catch (error) {
    dispatch(stopLoading())
    dispatch(fetchAllContactsFailure((error as Error).message));
    dispatch(setNotification({ message: 'Failed to fetch contacts', type: 'error', horizontal: 'right', vertical: 'top' }));
  }
};
