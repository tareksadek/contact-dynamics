import { OPEN_MODAL, CLOSE_MENU } from './actionTypes';

export type OpenModalAction = {
  type: typeof OPEN_MODAL;
  payload: string | null;
};

export type CloseMenuAction = {
  type: typeof CLOSE_MENU;
};

export type ModalActionTypes = OpenModalAction | CloseMenuAction;

export const openModal = (modalName: string) => ({
  type: OPEN_MODAL,
  payload: modalName
});

export const closeMenu = () => ({
  type: CLOSE_MENU
});
