import * as React from 'react';
import ReactDOM from 'react-dom';

import classNames from 'classnames';
import LayoutHeader from '@/components/semantic/LayoutHeader';

import IconConstants from '@/constants/IconConstants';

import 'fomantic-ui-css/components/modal';
import 'fomantic-ui-css/components/modal.min.css';

import { IconType } from '@/components/semantic/Icon';
import { Translation } from 'react-i18next';

import * as UI from '@/types/ui';
import { translate } from '@/utils/TranslationUtils';
import { CommonModalProps, useModal } from './effects/useModal';
import Button from './Button';

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

  const { ref, hide, saving, modalNodeId } = useModal(props, {
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

  const mainClass = classNames('ui modal', { full: fullHeight }, className);
  const node = document.getElementById(modalNodeId)!;
  return ReactDOM.createPortal(
    <div role="dialog" ref={ref} className={mainClass} id={id}>
      <LayoutHeader title={title} icon={icon} subHeader={subHeader} size="" />
      <div className="content">{children}</div>

      <Translation>
        {(t) =>
          props.onApprove ? (
            <div className="actions">
              <Button
                caption={approveCaption || translate('Save', t, UI.Modules.COMMON)}
                icon={IconConstants.SAVE_COLORED}
                disabled={approveDisabled}
                loading={saving}
                color="green"
                className="ok basic submit"
              />
              <Button
                caption={translate('Cancel', t, UI.Modules.COMMON)}
                icon={IconConstants.CANCEL}
                color="red basic"
                className="cancel"
              />
            </div>
          ) : (
            <div className="actions">
              <Button
                caption={translate('Close', t, UI.Modules.COMMON)}
                icon={IconConstants.CLOSE}
                className="cancel"
              />
            </div>
          )
        }
      </Translation>
    </div>,
    node,
  );
});

export default Modal;
