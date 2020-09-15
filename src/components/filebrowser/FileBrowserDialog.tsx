//import PropTypes from 'prop-types';
import React from 'react';
import Modal, { ModalProps } from 'components/semantic/Modal';

import FileBrowserLayout, { FileBrowserLayoutProps } from './FileBrowserLayout';

import ModalRouteDecorator from 'decorators/ModalRouteDecorator';
import { Translation } from 'react-i18next';
import { translate } from 'utils/TranslationUtils';

import * as UI from 'types/ui';
import IconConstants from 'constants/IconConstants';


interface FileBrowserDialogProps 
  extends Omit<ModalProps, 'title'>, 
  Pick<FileBrowserLayoutProps, 'historyId' | 'initialPath' | 'selectMode'> {
    
  onConfirm: (path: string) => void;
  title?: React.ReactNode;
}

export class FileBrowserDialog extends React.Component<FileBrowserDialogProps> {
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

  onFileSelected = (path: string) => {
    this.props.onConfirm(path);
  }

  onConfirm = () => {
    this.props.onConfirm(this.state.currentPath);
    return Promise.resolve();
  }

  render() {
    const { currentPath } = this.state;
    const { title, initialPath, historyId, selectMode, ...other } = this.props;

    const showApprove = selectMode === UI.FileSelectModeEnum.DIRECTORY ? true : false;
    return (
      <Translation>
        { t => (
          <Modal
            { ...other }
            className="file-browser-dialog"
            title={ title || translate('Browse...', t, UI.Modules.COMMON) } 
            onApprove={ showApprove ? this.onConfirm : undefined }  
            closable={ true }
            fullHeight={ true }
            approveDisabled={ currentPath.length === 0 }
            approveCaption={ translate('Select', t, UI.Modules.COMMON) }
            icon={ IconConstants.BROWSE }
          >
            <FileBrowserLayout
              initialPath={ initialPath }
              onDirectoryChanged={ this.onDirectoryChanged }
              onFileSelected={ this.onFileSelected }
              historyId={ historyId }
              selectMode={ selectMode }
            />
          </Modal>
        ) }
      </Translation>
    );
  }
}

export const FileBrowserRouteDialog = ModalRouteDecorator<FileBrowserDialogProps>(
  (props) => (
    <FileBrowserDialog
      {...props}
    />
  ),
  'browse'
);