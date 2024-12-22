import * as React from 'react';
import ReactDOM from 'react-dom';

import classNames from 'classnames';
import LayoutHeader from 'components/semantic/LayoutHeader';

import IconConstants from 'constants/IconConstants';

import 'fomantic-ui-css/components/modal';
import 'fomantic-ui-css/components/modal.min.css';

import Icon, { IconType } from 'components/semantic/Icon';
import { Translation } from 'react-i18next';

import * as UI from 'types/ui';
import { translate } from 'utils/TranslationUtils';
import { CommonModalProps, MODAL_NODE_ID, useModal } from './effects/useModal';

export type ModalProps = React.PropsWithChildren<
  {
    onReject?: () => void;

    approveCaption?: React.ReactNode;
    approveDisabled?: boolean;
    closable?: boolean;

    fullHeight?: boolean;
    className?: string;
    id?: string;
    dynamicHeight?: boolean;

    // Header
    icon?: IconType;
    title: React.ReactNode;
    subHeader?: React.ReactNode;
  } & CommonModalProps
>;

export interface ModalHandle {
  hide: () => void;
  show: () => void;
}

const Modal = React.forwardRef<ModalHandle, ModalProps>(function Modal(props, handle) {
  const show = () => {
    setTimeout(() => {
      $(ref.current!).modal('show');
    });
  };

  const { ref, hide, saving } = useModal(props, {
    onDeny: props.onReject,

    closable: props.closable,
    observeChanges: props.dynamicHeight,
  });

  React.useImperativeHandle(
    handle,
    () => ({
      hide,
      show,
    }),
    [ref.current],
  );

  const { approveDisabled, fullHeight, approveCaption, className, children, id } = props;
  const { icon, subHeader, title } = props;

  const approveStyle = classNames(
    'ui ok green basic button',
    { disabled: approveDisabled },
    { loading: saving },
  );

  const mainClass = classNames('ui modal', { full: fullHeight }, className);

  const node = document.getElementById(MODAL_NODE_ID)!;
  return ReactDOM.createPortal(
    <div ref={ref} className={mainClass} id={id} role="dialog">
      <LayoutHeader title={title} icon={icon} subHeader={subHeader} size="" />
      <div className="content">{children}</div>

      <Translation>
        {(t) =>
          props.onApprove ? (
            <div className="actions">
              <div className={approveStyle}>
                <Icon icon={IconConstants.SAVE_COLORED} />
                {approveCaption || translate('Save', t, UI.Modules.COMMON)}
              </div>
              <div className="ui cancel red basic button">
                <Icon icon={IconConstants.CANCEL} />
                {translate('Cancel', t, UI.Modules.COMMON)}
              </div>
            </div>
          ) : (
            <div className="actions">
              <div className="ui cancel button">
                <Icon icon={IconConstants.CLOSE} />
                {translate('Close', t, UI.Modules.COMMON)}
              </div>
            </div>
          )
        }
      </Translation>
    </div>,
    node,
  );
});

export default Modal;
