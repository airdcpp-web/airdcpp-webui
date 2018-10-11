//import PropTypes from 'prop-types';
import React from 'react';
import ReactDOM from 'react-dom';

import classNames from 'classnames';
import LayoutHeader from 'components/semantic/LayoutHeader';

import History from 'utils/History';

import IconConstants from 'constants/IconConstants';

import 'semantic-ui-css/components/modal';
import 'semantic-ui-css/components/modal.min.css';
import { IconType } from 'components/semantic/Icon';
import { SidebarStateContext, SidebarStateProps } from 'components/main/decorators/SidebarHandlerDecorator';
import { ModalRouteDecoratorChildProps } from 'decorators/ModalRouteDecorator';


export interface ModalProps {
  closable?: boolean;
  onApprove?: () => Promise<void>;
  approveCaption?: React.ReactNode;
  approveDisabled?: boolean;
  fullHeight?: boolean;
  className?: string;
  dynamicHeight?: boolean;

  // Header
  icon?: IconType;
  title: React.ReactNode;
  subHeader?: React.ReactNode;
}

class Modal extends React.Component<ModalProps & SidebarStateProps & ModalRouteDecoratorChildProps> {
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

  static defaultProps: Pick<ModalProps, 'closable' | 'approveCaption' | 'fullHeight' | 'dynamicHeight'> = {
    closable: true,
    approveCaption: 'Save',
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

    const settings = {
      onHidden: this.onHidden,
      onHide: this.onHide,

      onApprove: this.onApprove,
      closable: this.props.closable,
      detachable: false,
      allowMultiple: true,
      observeChanges: this.props.dynamicHeight,
      dimmerSettings: {
        dimmerName: 'modals-node',
      },
      //debug: true,
      //verbose: true,
      //name: 'Modal',
    } as SemanticUI.ModalSettings;

    $(this.c)
      .modal(settings);

    this.show();
  }

  componentWillUnmount() {
    if (!this.closing) {
      this.returnOnClose = false;
      this.hide();
    }
  }

  componentDidUpdate(prevProps: ModalProps & SidebarStateProps) {
    if (!prevProps.sidebarActive && this.props.sidebarActive) {
      this.returnOnClose = false;
      this.hide();
    } else if (!this.props.sidebarActive && prevProps.sidebarActive) {
      this.show();
    }
  }

  show = () => {
    setTimeout(() => $(this.c).modal('show'));
  }

  hide = () => {
    $(this.c).modal('hide');
  }

  onHide = () => {
    this.closing = true;
  }

  onHidden = () => {
    if (this.returnOnClose) {
      History.replace(this.props.returnTo /*, this.context.router.route.location.state*/);
      //this.props.closeModal();
    }
    
    this.returnOnClose = true;
  }

  onApprove = () => {
    let { onApprove } = this.props;
    if (onApprove) {
      this.setState({ saving: true });
      
      onApprove()
        .then(this.hide)
        .catch(() => this.setState({ saving: false }));
  
      return false;
    }

    return;
  }

  render() {
    const { saving } = this.state;
    const { approveDisabled, fullHeight, approveCaption, onApprove, className, children } = this.props;
    const { icon, subHeader, title } = this.props;

    const approveStyle = classNames(
      'ui ok green basic button',
      { 'disabled': approveDisabled },
      { 'loading': saving },
    );

    const mainClass = classNames(
      'ui modal',
      { 'full': fullHeight },
      className,
    );

    return ReactDOM.createPortal(
      (
        <div 
          ref={ c => this.c = c }
          className={ mainClass }
        >
          <LayoutHeader
            title={ title }
            icon={ icon }
            subHeader={ subHeader }
            size="medium"
          />
          <div className="content">
            { children }
          </div>

          { onApprove ? (
            <div className="actions">
              <div className={ approveStyle }>
                <i className={ IconConstants.SAVE + ' icon' }/>
                { approveCaption }
              </div>
              <div className="ui cancel red basic button">
                <i className="remove icon"/>
                Cancel
              </div>
            </div>
          ) : (
            <div className="actions">
              <div className="ui cancel button">
                <i className="remove icon"/>
                Close
              </div>
            </div>
          ) }
        </div>
      ), 
      document.getElementById('modals-node')!
    );
  }
}


export default React.forwardRef<Modal, ModalProps & ModalRouteDecoratorChildProps>(
  (props: ModalProps & ModalRouteDecoratorChildProps, ref) => (
    <SidebarStateContext.Consumer>
      { sidebarActive => (
        <Modal 
          ref={ ref }
          { ...props } 
          sidebarActive={ sidebarActive }
        />
      )}
    </SidebarStateContext.Consumer>
  )
);
