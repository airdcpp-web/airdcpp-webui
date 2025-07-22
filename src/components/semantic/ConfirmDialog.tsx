import * as React from 'react';
import ReactDOM from 'react-dom';

import cx from 'classnames';

import 'fomantic-ui-css/components/modal';
import 'fomantic-ui-css/components/modal.min.css';

import Icon, { IconType } from '@/components/semantic/Icon';
import IconConstants from '@/constants/IconConstants';
import { useModal } from './effects/useModal';
import Button from './Button';
import { useModalCloseContext } from '@/context/ModalCloseContext';

type ApproveHandler = () => Promise<void>;
type RejectHandler = (error: Error) => void;

interface ConfirmDialogOptions {
  icon?: IconType;

  content?: React.ReactNode;
  title: React.ReactNode;

  approveCaption: string;
  rejectCaption: string;
}

export type ConfirmDialogProps = ConfirmDialogOptions &
  React.PropsWithChildren<{
    onApproved: ApproveHandler;
    onRejected?: RejectHandler;
  }>;

const ConfirmDialog: React.FC<ConfirmDialogProps> = (props) => {
  const closeContext = useModalCloseContext();

  const onDeny = () => {
    if (props.onRejected) {
      props.onRejected(new Error('Denied'));
    }
  };

  const { ref, saving, modalNodeId } = useModal(
    { onApprove: props.onApproved },
    {
      onDeny,
      closable: false,
    },
  );

  const { title, icon, rejectCaption, approveCaption, content, children } = props;

  // We can't use the basic (fully dimmed) style inside other modals
  const basic = !closeContext;
  return ReactDOM.createPortal(
    <div
      role="dialog"
      ref={ref}
      className={cx('ui modal confirm-dialog', { basic: basic })}
    >
      <div className="header">{title}</div>
      <div className="image content">
        <div className="image">
          <Icon icon={icon} />
        </div>
        <div className="description">
          {content}
          {children}
        </div>
      </div>
      <div className="actions">
        <div className={cx('two fluid ui buttons', { inverted: basic })}>
          <Button
            icon={IconConstants.CANCEL}
            caption={rejectCaption}
            inverted={basic}
            color="red"
            className="cancel basic"
          />
          <Button
            icon={IconConstants.SAVE_PLAIN}
            caption={approveCaption}
            loading={saving}
            inverted={basic}
            color="green"
            className="ok basic submit"
          />
        </div>
      </div>
    </div>,
    document.getElementById(modalNodeId)!,
  );
};

export { ConfirmDialog };
