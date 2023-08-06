import * as React from 'react';
import Modal, { ModalProps } from 'components/semantic/Modal';

import FileBrowserLayout, { FileBrowserLayoutProps } from './FileBrowserLayout';

import ModalRouteDecorator from 'decorators/ModalRouteDecorator';
import { Translation } from 'react-i18next';
import { translate } from 'utils/TranslationUtils';

import * as UI from 'types/ui';
import IconConstants from 'constants/IconConstants';
import { getFileName, getFilePath } from 'utils/FileUtils';

interface FileBrowserDialogProps
  extends Omit<ModalProps, 'title' | 'location'>,
    Pick<FileBrowserLayoutProps, 'historyId' | 'initialPath' | 'selectMode'> {
  onConfirm: (path: string, directoryPath: string, fileName: string) => void;
  title?: React.ReactNode;
}

interface State {
  currentPath: string;
  currentFileName: string;
}

export class FileBrowserDialog extends React.Component<FileBrowserDialogProps, State> {
  static displayName = 'FileBrowserDialog';

  static defaultProps: Pick<FileBrowserDialogProps, 'title' | 'initialPath'> = {
    initialPath: '',
  };

  state: State = {
    currentPath: getFilePath(this.props.initialPath),
    currentFileName: getFileName(this.props.initialPath),
  };

  onDirectoryChanged = (path: string) => {
    this.setState({
      currentPath: path,
    });
  };

  onFileSelected = (fileName: string) => {
    const { selectMode, onConfirm } = this.props;
    if (selectMode === UI.FileSelectModeEnum.EXISTING_FILE) {
      const { currentPath } = this.state;
      onConfirm(currentPath + fileName, currentPath, fileName);
    } else {
      this.setState({
        currentFileName: fileName,
      });
    }
  };

  onConfirm = () => {
    const { selectMode, onConfirm } = this.props;
    const { currentPath, currentFileName } = this.state;
    if (selectMode === UI.FileSelectModeEnum.DIRECTORY) {
      onConfirm(currentPath, currentPath, currentFileName);
    } else {
      onConfirm(currentPath + currentFileName, currentPath, currentFileName);
    }

    return Promise.resolve();
  };

  approveDisabled = () => {
    const { currentPath, currentFileName } = this.state;
    if (currentPath.length === 0) {
      return true;
    }

    const { selectMode } = this.props;
    if (selectMode === UI.FileSelectModeEnum.FILE && currentFileName.length === 0) {
      return true;
    }

    return false;
  };

  render() {
    const { currentFileName } = this.state;
    const { title, initialPath, historyId, selectMode, icon, approveCaption, ...other } =
      this.props;

    const selectDirectory = selectMode === UI.FileSelectModeEnum.DIRECTORY;
    const showApprove = selectMode !== UI.FileSelectModeEnum.EXISTING_FILE ? true : false;
    return (
      <Translation>
        {(t) => (
          <Modal
            {...other}
            className="file-browser-dialog"
            title={title || translate('Browse...', t, UI.Modules.COMMON)}
            onApprove={showApprove ? this.onConfirm : undefined}
            closable={true}
            fullHeight={true}
            approveDisabled={this.approveDisabled()}
            approveCaption={approveCaption || translate('Select', t, UI.Modules.COMMON)}
            icon={icon || (selectDirectory ? IconConstants.BROWSE : IconConstants.FILE)}
          >
            <FileBrowserLayout
              initialPath={getFilePath(initialPath)}
              onDirectoryChanged={this.onDirectoryChanged}
              onFileSelected={this.onFileSelected}
              historyId={historyId}
              selectMode={selectMode}
              currentFileName={currentFileName}
            />
          </Modal>
        )}
      </Translation>
    );
  }
}

export const FileBrowserRouteDialog = ModalRouteDecorator<FileBrowserDialogProps>(
  (props) => <FileBrowserDialog {...props} />,
  'browse',
);
