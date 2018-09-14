//import PropTypes from 'prop-types';
import React from 'react';

import OverlayDecorator, { OverlayDecoratorChildProps } from 'decorators/OverlayDecorator';
import classNames from 'classnames';
import LayoutHeader from 'components/semantic/LayoutHeader';

import IconConstants from 'constants/IconConstants';

import 'semantic-ui-css/components/modal';
import 'semantic-ui-css/components/modal.min.css';
import { IconType } from 'components/semantic/Icon';


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

class Modal extends React.Component<ModalProps & OverlayDecoratorChildProps<SemanticUI.ModalSettings>> {
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

  static defaultProps: Partial<ModalProps> = {
    closable: true,
    approveCaption: 'Save',
    fullHeight: false,
    dynamicHeight: false,
  };

  state = {
    saving: false,
  };

  c: any;
  onApprove = () => {
    let { onApprove } = this.props;
    if (onApprove) {
      this.setState({ saving: true });
      
      onApprove()
        .then(this.props.hide)
        .catch(() => this.setState({ saving: false }));
  
      return false;
    }

    return;
  }

  componentDidMount() {
    this.props.showOverlay(this.c, {
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
    });
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

    return (
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
    );
  }
}

export default OverlayDecorator<ModalProps, SemanticUI.ModalSettings>(Modal, 'modal');
