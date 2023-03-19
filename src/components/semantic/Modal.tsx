//import PropTypes from 'prop-types';
import * as React from 'react';
import ReactDOM from 'react-dom';

import classNames from 'classnames';
import LayoutHeader from 'components/semantic/LayoutHeader';

import History from 'utils/History';

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

class Modal extends React.Component<ModalProps> {
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

  static defaultProps: Pick<
    ModalProps,
    'closable' | 'approveCaption' | 'fullHeight' | 'dynamicHeight'
  > = {
    closable: true,
    //approveCaption: 'Save',
    fullHeight: false,
    dynamicHeight: false,
  };

  state = {
    saving: false,
  };

  c: any;

  closing = false;
  returnOnClose = true;

  componentDidMount() {
    this.returnOnClose = true;

    const settings: SemanticUI.ModalSettings = {
      onHidden: this.onHidden,
      onHide: this.onHide,

      onApprove: this.onApprove,
      onDeny: this.props.onReject,
      closable: this.props.closable,
      detachable: false,
      allowMultiple: true,
      observeChanges: this.props.dynamicHeight,
      dimmerSettings: {
        dimmerName: NODE_ID,
        //namespace: NODE_ID,
        /*selector: {
          dimmer: `> .ui.dimmer.${NODE_ID}`
        }*/
      },
      //namespace: `${NODE_ID}`,
      /*className: {
        active: NODE_ID,
      },*/
      //debug: true,
      //verbose: true,
      //name: 'Modal',
    };

    $(this.c).modal(settings);

    this.show();
  }

  componentWillUnmount() {
    if (!this.closing) {
      this.returnOnClose = false;
      this.hide();
    }
  }

  show = () => {
    setTimeout(() => $(this.c).modal('show'));
  };

  hide = () => {
    $(this.c).modal('hide');
  };

  onHide = () => {
    this.closing = true;
  };

  onHidden = () => {
    if (this.returnOnClose && this.props.returnTo) {
      History.replace(this.props.returnTo);
    }

    this.returnOnClose = true;

    if (this.props.onClose) {
      this.props.onClose();
    }
  };

  onApprove = () => {
    const { onApprove } = this.props;
    if (onApprove) {
      this.setState({ saving: true });

      onApprove()
        .then(this.hide)
        .catch(() => this.setState({ saving: false }));

      return false;
    }

    return;
  };

  render() {
    const { saving } = this.state;
    const {
      approveDisabled,
      fullHeight,
      approveCaption,
      onApprove,
      className,
      children,
    } = this.props;
    const { icon, subHeader, title } = this.props;

    const approveStyle = classNames(
      'ui ok green basic button',
      { disabled: approveDisabled },
      { loading: saving }
    );

    const mainClass = classNames('ui modal', { full: fullHeight }, className);

    return ReactDOM.createPortal(
      <div ref={(c) => (this.c = c)} className={mainClass}>
        <LayoutHeader title={title} icon={icon} subHeader={subHeader} size="" />
        <div className="content">{children}</div>

        <Translation>
          {(t) =>
            onApprove ? (
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
  }
}

export default Modal;
