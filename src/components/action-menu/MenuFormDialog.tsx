import { useRef } from 'react';
import * as React from 'react';

import Modal, { ModalProps } from '@/components/semantic/Modal';
import Form, { FormSaveHandler } from '@/components/form/Form';

import * as UI from '@/types/ui';

import { IconType } from '@/components/semantic/Icon';
import { useTranslation } from 'react-i18next';
import { translate } from '@/utils/TranslationUtils';

export interface MenuFormDialogProps extends ModalProps {
  title: string;
  icon: IconType;
  fieldDefinitions: UI.FormFieldDefinition[];
  onSave: FormSaveHandler<UI.FormValueMap>;
}

export const MenuFormDialog: React.FC<MenuFormDialogProps> = ({
  fieldDefinitions,
  onSave,
  title,
  icon,
  ...other
}) => {
  const formRef = useRef<Form | null>(null);
  const { t } = useTranslation();
  return (
    <Modal
      {...other}
      title={title}
      onApprove={() => formRef.current!.save()}
      approveCaption={translate('Continue', t, UI.Modules.COMMON)}
      closable={false}
      icon={icon}
      dynamicHeight={true}
    >
      <Form ref={formRef} onSave={onSave} fieldDefinitions={fieldDefinitions} />
    </Modal>
  );
};
