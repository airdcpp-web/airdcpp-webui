import * as React from 'react';

import Checkbox from 'components/semantic/Checkbox';

import 'fomantic-ui-css/components/modal';
import 'fomantic-ui-css/components/modal.min.css';

import { ConfirmDialog, ConfirmDialogProps } from './ConfirmDialog';

type ApproveHandler = (checked: boolean) => Promise<void>;

export interface CheckboxDialogProps extends Omit<ConfirmDialogProps, 'onApproved'> {
  onApproved: ApproveHandler;

  checkboxCaption?: React.ReactNode;
}

const CheckboxDialog: React.FC<CheckboxDialogProps> = ({
  onApproved,
  checkboxCaption,
  ...other
}) => {
  const checked = React.useRef(false);

  const onApprove = () => {
    return onApproved(checked.current);
  };

  return (
    <ConfirmDialog onApproved={onApprove} {...other}>
      {checkboxCaption && (
        <Checkbox
          checked={false}
          onChange={(state) => (checked.current = state)}
          caption={checkboxCaption}
        />
      )}
    </ConfirmDialog>
  );
};

export { CheckboxDialog };
