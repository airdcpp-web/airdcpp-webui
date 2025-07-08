import * as React from 'react';

import Modal, { ModalProps } from './Modal';
import { useModalCloseContext } from '@/context/ModalCloseContext';
import { ModalCloseHandler } from './effects/useModal';

export type RouteModalProps = Omit<ModalProps, 'onClose' | 'onHide'>;

export const RouteModal: React.FC<RouteModalProps> = (props) => {
  const closeModalRoute = useModalCloseContext();

  const onClose: ModalCloseHandler = (wasClean) => {
    if (closeModalRoute && wasClean) {
      setTimeout(() => closeModalRoute());
    }
  };

  return <Modal {...props} onClose={onClose} />;
};

export default RouteModal;
