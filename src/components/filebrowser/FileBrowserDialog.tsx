//import PropTypes from 'prop-types';
import React from 'react';
import Modal, { ModalProps } from 'components/semantic/Modal';

import FileBrowserLayout, { FileBrowserLayoutProps } from './FileBrowserLayout';

import ModalRouteDecorator, { ModalRouteDecoratorChildProps } from 'decorators/ModalRouteDecorator';
import { Translation } from 'react-i18next';
import { translate } from 'utils/TranslationUtils';

import * as UI from 'types/ui';


interface FileBrowserDialogProps 
  extends Omit<ModalProps, 'title' | keyof ModalRouteDecoratorChildProps>, 
  Pick<FileBrowserLayoutProps, 'historyId' | 'initialPath'> {
    
  onConfirm: (path: string) => void;
  title?: React.ReactNode;
}

class FileBrowserDialog extends React.Component<FileBrowserDialogProps & ModalRouteDecoratorChildProps> {
  static displayName = 'FileBrowserDialog';

  /*static propTypes = {
		 // Function handling the path selection. Receives the selected path as argument.
		 // Required
    onConfirm: PropTypes.func,

    // Information about the item to download
    title: PropTypes.node,

    initialPath: PropTypes.string,
  };*/

  static defaultProps: Pick<FileBrowserDialogProps, 'title' | 'initialPath'> = {
    initialPath: '',
  };

  state = {
    currentPath: this.props.initialPath,
  };

  onDirectoryChanged = (path: string) => {
    this.setState({ 
      currentPath: path 
    });
  }

  onConfirm = () => {
    this.props.onConfirm(this.state.currentPath);
    return Promise.resolve();
  }

  render() {
    const { currentPath } = this.state;
    const { title, initialPath, historyId } = this.props;
    return (
      <Translation>
        { t => (
          <Modal
            { ...this.props }
            className="file-browser-dialog"
            title={ title || translate('Browse...', t, UI.Modules.COMMON) } 
            onApprove={ this.onConfirm }  
            closable={ true }
            fullHeight={ true }
            approveDisabled={ currentPath.length === 0 }
            approveCaption={ translate('Select', t, UI.Modules.COMMON) }
            icon="yellow folder open"
          >
            <FileBrowserLayout
              initialPath={ initialPath }
              onDirectoryChanged={ this.onDirectoryChanged }
              historyId={ historyId }
            />
          </Modal>
        ) }
      </Translation>
    );
  }
}

export default ModalRouteDecorator<FileBrowserDialogProps>(
  FileBrowserDialog,
  'browse'
);