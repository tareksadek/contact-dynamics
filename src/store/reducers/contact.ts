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
} from '../actions/actionTypes';

import { 
  AddNewContactSuccessAction,
  AddNewContactFailureAction,
  DeleteContactSuccessAction,
  DeleteContactFailureAction,
  UpdateContactSuccessAction,
  UpdateContactFailureAction,
  FetchAllContactsSuccessAction,
  FetchAllContactsFailureAction
} from '../actions/contact';

import { ContactsActionTypes } from '../actions/contact';

import { ContactType } from '../../types/contact';


const initialState: {
  contacts: ContactType[] | null;
  contactsLoaded: boolean;
  profileId: string | null;
  loading: boolean;
  error: string | null;
} = {
  contacts: null,
  contactsLoaded: false,
  profileId: null,
  loading: false,
  error: null,
};

const sortContactsByFirstName = (contacts: ContactType[]) => {
  return [...contacts].sort((a, b) => {
    if (a.firstName < b.firstName) return -1;
    if (a.firstName > b.firstName) return 1;
    return 0;
  });
};

const addNewContactRequest = (state = initialState) => ({
  ...state,
  loading: true
});

const addNewContactSuccess = (state = initialState, action: AddNewContactSuccessAction) => {
  const updatedContacts = state.contacts ? [...state.contacts, action.payload] : [action.payload];
  const sortedContacts = sortContactsByFirstName(updatedContacts);
  
  return {
    ...state,
    contacts: sortedContacts,
    loading: false,
    error: null
  };
};

const addNewContactFailure = (state = initialState, action: AddNewContactFailureAction) => ({
  ...state,
  loading: false,
  error: action.payload
});

const deleteContactRequest = (state = initialState) => ({
  ...state,
  loading: true
});

const deleteContactSuccess = (state = initialState, action: DeleteContactSuccessAction) => ({
  ...state,
  contacts: state.contacts ? state.contacts.filter(contact => contact.id !== action.payload.id) : [],
  loading: false,
  error: null
});

const deleteContactFailure = (state = initialState, action: DeleteContactFailureAction) => ({
  ...state,
  loading: false,
  error: action.error
});

const updateContactRequest = (state = initialState) => ({
  ...state,
  loading: true
});

const updateContactSuccess = (state = initialState, action: UpdateContactSuccessAction) => {
  const updatedContacts = state.contacts 
    ? state.contacts.map(contact => contact.id === action.payload.id ? action.payload : contact)
    : [];
  return {
    ...state,
    contacts: updatedContacts,
    loading: false,
    error: null
  };
};

const updateContactFailure = (state = initialState, action: UpdateContactFailureAction) => ({
  ...state,
  loading: false,
  error: action.error
});

const fetchAllContactsRequest = (state = initialState) => ({
  ...state,
  loading: true
});

const fetchAllContactsSuccess = (state = initialState, action: FetchAllContactsSuccessAction) => ({
  ...state,
  contacts: action.payload.contacts,
  profileId: action.payload.profileId,
  contactsLoaded: true,
  loading: false,
  error: null
});

const fetchAllContactsFailure = (state = initialState, action: FetchAllContactsFailureAction) => ({
  ...state,
  contacts: null,
  contactsLoaded: false,
  loading: false,
  error: action.payload
});

const contactReducer = (state = initialState, action: ContactsActionTypes): typeof initialState => {
  switch (action.type) {
    case ADD_NEW_CONTACT_REQUEST: return addNewContactRequest(state);
    case ADD_NEW_CONTACT_SUCCESS: return addNewContactSuccess(state, action);
    case ADD_NEW_CONTACT_FAILURE: return addNewContactFailure(state, action);
    case DELETE_CONTACT_REQUEST: return deleteContactRequest(state);
    case DELETE_CONTACT_SUCCESS: return deleteContactSuccess(state, action);
    case DELETE_CONTACT_FAILURE: return deleteContactFailure(state, action);
    case UPDATE_CONTACT_REQUEST: return updateContactRequest(state);
    case UPDATE_CONTACT_SUCCESS: return updateContactSuccess(state, action);
    case UPDATE_CONTACT_FAILURE: return updateContactFailure(state, action);
    case FETCH_ALL_CONTACTS_REQUEST: return fetchAllContactsRequest(state);
    case FETCH_ALL_CONTACTS_SUCCESS: return fetchAllContactsSuccess(state, action);
    case FETCH_ALL_CONTACTS_FAILURE: return fetchAllContactsFailure(state, action);
    default: return state;
  }
};

export default contactReducer;
