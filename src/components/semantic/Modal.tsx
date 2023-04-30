//import PropTypes from 'prop-types';
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
import { useNavigate } from 'react-router-dom';

export type ModalProps = React.PropsWithChildren<{
  closable?: boolean;
  onApprove?: () => Promise<void>;
  onReject?: () => void;
  onClose?: () => void;
  approveCaption?: React.ReactNode;
  approveDisabled?: boolean;
  fullHeight?: boolean;
  className?: string;
  dynamicHeight?: boolean;
  returnTo?: string;

  // Header
  icon?: IconType;
  title: React.ReactNode;
  subHeader?: React.ReactNode;
}>;

const NODE_ID = 'modals-node';

const Modal: React.FC<ModalProps> = (props) => {
  /*static propTypes = {
    // Close the modal when clicking outside its boundaries
    closable: PropTypes.bool,

    // Function to call when the dialog is approved
    // If no handler is supplied, there will only be a plain close button
    onApprove: PropTypes.func,

    // Caption for the approve button
    approveCaption: PropTypes.node,

    // Use disabled style for the approve button
    approveDisabled: PropTypes.bool,

    // The modal will always use the maximum allowed width when set,
    // instead of adjusting the height dynamically.
    // Useful for modals with navigable, varying height content
    fullHeight: PropTypes.bool,

    dynamicHeight: PropTypes.bool,

    showOverlay: PropTypes.func.isRequired,
    hide: PropTypes.func.isRequired,
  };*/

  /*static defaultProps: Pick<
    ModalProps,
    'closable' | 'approveCaption' | 'fullHeight' | 'dynamicHeight'
  > = {
    closable: true,
    fullHeight: false,
    dynamicHeight: false,
  };

  state = {
    saving: false,
  };*/

  // c: any;

  // closing = false;
  // returnOnClose = true;

  const ref = React.useRef<HTMLDivElement>(null);
  const [saving, setSaving] = React.useState(false);
  const [closing, setClosing] = React.useState(false);
  const [returnOnClose, setReturnOnClose] = React.useState(false);
  const navigate = useNavigate();

  const show = () => {
    setTimeout(() => $(ref).modal('show'));
  };

  const hide = () => {
    $(ref).modal('hide');
  };

  const onHide = () => {
    setClosing(true);
    // this.closing = true;
  };

  const onHidden = () => {
    const { returnTo, onClose } = props;
    if (returnOnClose && returnTo) {
      navigate(returnTo);
    }

    setReturnOnClose(true);
    // this.returnOnClose = true;

    if (onClose) {
      onClose();
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

  React.useEffect(() => {
    // this.returnOnClose = true;

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

    $(ref).modal(settings);

    show();

    return () => {
      if (!closing) {
        // this.returnOnClose = false;
        setReturnOnClose(true);
        hide();
      }
    };
  }, []);

  /*componentWillUnmount() {
    if (!this.closing) {
      this.returnOnClose = false;
      this.hide();
    }
  }*/

  // const { saving } = this.state;
  const { approveDisabled, fullHeight, approveCaption, className, children } = props;
  const { icon, subHeader, title } = props;

  const approveStyle = classNames(
    'ui ok green basic button',
    { disabled: approveDisabled },
    { loading: saving }
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
    document.getElementById(NODE_ID)!
  );
};

export default Modal;
