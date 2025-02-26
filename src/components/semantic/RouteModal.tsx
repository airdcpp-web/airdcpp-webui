import * as React from 'react';

import { ModalRouteCloseContext } from '@/decorators/ModalRouteDecorator';
import Modal, { ModalProps } from './Modal';

export type RouteModalProps = Omit<ModalProps, 'onClose' | 'onHide'>;

export const RouteModal: React.FC<RouteModalProps> = (props) => {
  const closeModalRoute = React.useContext(ModalRouteCloseContext);

  const onClose = (wasClean: boolean) => {
    if (closeModalRoute && wasClean) {
      setTimeout(() => closeModalRoute());
    }
  };

  return <Modal {...props} onClose={onClose} />;
};

export default RouteModal;
