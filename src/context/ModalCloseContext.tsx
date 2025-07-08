import React from 'react';

export type CloseModal = () => Promise<void>;

export type ModalCloseContext = CloseModal;

export const ModalRouteCloseContext = React.createContext<ModalCloseContext | undefined>(
  undefined,
);

export const useModalCloseContext = () => {
  const closeModal = React.useContext(ModalRouteCloseContext);
  return closeModal;
};
