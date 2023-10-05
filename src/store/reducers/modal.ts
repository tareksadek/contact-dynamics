import { OPEN_MODAL, CLOSE_MENU } from "../actions/actionTypes";
import { ModalActionTypes } from "../actions/modal";

type ModalState = {
  openModal: string | null;
};

const initialState: ModalState = {
  openModal: null
};

const openModal = (state: ModalState, modalName: string | null): ModalState => ({
  ...state,
  openModal: modalName
});

const closeModal = (state: ModalState): ModalState => ({
  ...state,
  openModal: null
});

const modalReducer = (state = initialState, action: ModalActionTypes) => {
  switch (action.type) {
    case OPEN_MODAL: return openModal(state, action.payload);
    case CLOSE_MENU: return closeModal(state);
    default: return state;
  }
};

export default modalReducer;
