import * as React from 'react';
import ReactDOM from 'react-dom';

import cx from 'classnames';

import Checkbox from 'components/semantic/Checkbox';

import 'fomantic-ui-css/components/modal';
import 'fomantic-ui-css/components/modal.min.css';

import Icon, { IconType } from 'components/semantic/Icon';
import { ModalRouteCloseContext } from 'decorators/ModalRouteDecorator';
import IconConstants from 'constants/IconConstants';
import { MODAL_NODE_ID, useModal } from './effects/useModal';

type ApproveHandler = (checked: boolean) => Promise<void>;
type RejectHandler = (error: Error) => void;

interface ConfirmDialogOptions {
  icon?: IconType;

  content?: React.ReactNode;
  title: React.ReactNode;

  approveCaption: string;
  rejectCaption: string;

  checkboxCaption?: React.ReactNode;
}

export type ConfirmDialogProps = ConfirmDialogOptions &
  React.PropsWithChildren<{
    onApproved: ApproveHandler;
    onRejected?: RejectHandler;
  }>;

const ConfirmDialog: React.FC<ConfirmDialogProps> = (props) => {
  const closeContext = React.useContext(ModalRouteCloseContext);

  const [checked, setChecked] = React.useState(false);

  const onDeny = () => {
    if (props.onRejected) {
      props.onRejected(new Error('Denied'));
    }
  };

  const onApprove = () => {
    return props.onApproved(checked);
  };

  const { ref, saving } = useModal(
    { onApprove },
    {
      onDeny,
      closable: false,
    },
  );

  const {
    title,
    icon,
    checkboxCaption,
    rejectCaption,
    approveCaption,
    content,
    children,
  } = props;

  // We can't use the basic (fully dimmed) style inside other modals
  const basic = !closeContext;
  return ReactDOM.createPortal(
    <div ref={ref} className={cx('ui modal confirm-dialog', { basic: basic })}>
      <div className="header">{title}</div>
      <div className="image content">
        <div className="image">
          <Icon icon={icon} />
        </div>
        <div className="description">
          {content}
          {children}
          {!!checkboxCaption && (
            <Checkbox checked={false} onChange={setChecked} caption={checkboxCaption} />
          )}
        </div>
      </div>
      <div className="actions">
        <div className={cx('two fluid ui buttons', { inverted: basic })}>
          <div className={cx('ui cancel red basic button', { inverted: basic })}>
            <Icon icon={IconConstants.CANCEL} />
            {rejectCaption}
          </div>
          <div
            className={cx('ui ok green basic submit button', {
              inverted: basic,
              loading: saving,
            })}
          >
            <Icon icon={IconConstants.SAVE_PLAIN} />
            {approveCaption}
          </div>
        </div>
      </div>
    </div>,
    document.getElementById(MODAL_NODE_ID)!,
  );
};

export { ConfirmDialog };
