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

export type ModalProps = React.PropsWithChildren<{
  closable?: boolean;
  onApprove?: () => Promise<void>;
  onReject?: () => void;

  // wasClean is false when using browser navigation
  onClose?: (wasClean: boolean) => void;
  approveCaption?: React.ReactNode;
  approveDisabled?: boolean;
  fullHeight?: boolean;
  className?: string;
  dynamicHeight?: boolean;

  // Header
  icon?: IconType;
  title: React.ReactNode;
  subHeader?: React.ReactNode;
}>;

const NODE_ID = 'modals-node';

export interface ModalHandle {
  hide: () => void;
  show: () => void;
}

const Modal = React.forwardRef<ModalHandle, ModalProps>(function Modal(props, handle) {
  const ref = React.useRef<HTMLDivElement>(null);
  const [saving, setSaving] = React.useState(false);

  // Set to true when the modal is being closed cleanly (backdrop click/action buttons)
  // We need to clean the DOM for non-clean closures
  const closingCleanly = React.useRef(false);

  const show = () => {
    setTimeout(() => {
      $(ref.current!).modal('show');
    });
  };

  const hide = () => {
    closingCleanly.current = true;
    if (ref.current) {
      $(ref.current).modal('hide');
    }
  };

  React.useImperativeHandle(
    handle,
    () => ({
      hide,
      show,
    }),
    [ref.current],
  );

  const onHide = () => {
    closingCleanly.current = true;
  };

  const onHidden = () => {
    const { onClose } = props;
    if (onClose) {
      onClose(closingCleanly.current);
    }
  };

  const onApprove = () => {
    const { onApprove } = props;
    if (onApprove) {
      setSaving(true);

      onApprove()
        .then(hide)
        .catch(() => setSaving(false));

      return false;
    }

    return;
  };

  React.useLayoutEffect(() => {
    const settings: SemanticUI.ModalSettings = {
      onHidden: onHidden,
      onHide: onHide,

      onApprove: onApprove,
      onDeny: props.onReject,
      closable: props.closable,
      detachable: false,
      allowMultiple: true,
      observeChanges: props.dynamicHeight,
      dimmerSettings: {
        dimmerName: NODE_ID,
      },
      //debug: true,
      //verbose: true,
      //name: 'Modal',
    };

    $(ref.current!).modal(settings);
    show();

    return () => {
      if (!closingCleanly.current) {
        // History navigation event, we still need to clean up the dimmer
        if (ref.current) {
          hide();
          closingCleanly.current = false;
        }
      }
    };
  }, []);

  const { approveDisabled, fullHeight, approveCaption, className, children } = props;
  const { icon, subHeader, title } = props;

  const approveStyle = classNames(
    'ui ok green basic button',
    { disabled: approveDisabled },
    { loading: saving },
  );

  const mainClass = classNames('ui modal', { full: fullHeight }, className);

  return ReactDOM.createPortal(
    <div ref={ref} className={mainClass}>
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
    document.getElementById(NODE_ID)!,
  );
});

export default Modal;
