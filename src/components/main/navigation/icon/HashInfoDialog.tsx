import React from 'react';

import Modal, { ModalProps } from 'components/semantic/Modal';

import * as API from 'types/api';
import * as UI from 'types/ui';

import { HashInfoLayout } from './HashInfoLayout';
import IconConstants from 'constants/IconConstants';
import { getModuleT } from 'utils/TranslationUtils';
import { useTranslation } from 'react-i18next';


interface HashInfoDialogProps extends Omit<ModalProps, 'title'> {
  stats: API.HashStats;
  onClose: () => void;
}

export const HashInfoDialog: React.FC<HashInfoDialogProps> = (
  { onClose, stats, ...other }
) => {
  const { t } = useTranslation();
  const moduleT = getModuleT(t, UI.Modules.HASH);
  return (
    <Modal 
      { ...other } 
      title={ moduleT.translate('Hash progress') } 
      onClose={ onClose }
      closable={ true } 
      icon={ IconConstants.HASH }
      dynamicHeight={ true }
      className="tiny"
    >
      <HashInfoLayout
        stats={ stats }
        moduleT={ moduleT }
      />
    </Modal>
  );
};
