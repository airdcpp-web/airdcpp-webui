import PropTypes from 'prop-types';
import React from 'react';
import Modal from 'components/semantic/Modal';

import FileBrowserLayout from './FileBrowserLayout';

import ModalRouteDecorator from 'decorators/ModalRouteDecorator';
import OverlayConstants from 'constants/OverlayConstants';


class FileBrowserDialog extends React.Component {
  static displayName = 'FileBrowserDialog';

  static propTypes = {
    /**
		 * Function handling the path selection. Receives the selected path as argument.
		 * Required
		 */
    onConfirm: PropTypes.func,

    /**
		 * Information about the item to download
		 */
    title: PropTypes.node,
  };

  static defaultProps = {
    title: 'Browse...',
    initialPath: '',
  };

  state = {
    currentPath: this.props.initialPath,
  };

  onDirectoryChanged = (path) => {
    this.setState({ 
      currentPath: path 
    });
  };

  onConfirm = () => {
    this.props.onConfirm(this.state.currentPath);
    return Promise.resolve();
  };

  render() {
    const { currentPath } = this.state;
    const { title, initialPath, historyId } = this.props;
    return (
      <Modal
        { ...this.props }
        className="file-browser-dialog"
        title={ title } 
        onApprove={ this.onConfirm }  
        closable={ true }
        fullHeight={ true }
        approveDisabled={ currentPath.length === 0 }
        approveCaption="Select"
        icon="yellow folder open"
      >
        <FileBrowserLayout
          initialPath={ initialPath }
          onDirectoryChanged={ this.onDirectoryChanged }
          historyId={ historyId }
        />
      </Modal>
    );
  }
}

export default ModalRouteDecorator(FileBrowserDialog, OverlayConstants.FILE_BROWSER_MODAL, 'browse');