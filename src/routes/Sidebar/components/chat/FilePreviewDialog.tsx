//import PropTypes from 'prop-types';
import React from 'react';
import Modal, { ModalProps } from 'components/semantic/Modal';

import IconConstants from 'constants/IconConstants';
//import FileBrowserLayout from './FileBrowserLayout';

//import ModalRouteDecorator, { ModalRouteDecoratorChildProps } from 'decorators/ModalRouteDecorator';


/*Omit<ModalProps, 'title' | keyof ModalRouteDecoratorChildProps>*/

interface FilePreviewDialogProps extends ModalProps {
  file: File;
  //initialPath: string;
  onConfirm: (file: File) => Promise<void>;
  //title?: React.ReactNode;
  //historyId: string;

}

class FilePreviewDialog extends React.Component<FilePreviewDialogProps/* & ModalRouteDecoratorChildProps*/> {
  static displayName = 'FilePreviewDialog';

  /*static propTypes = {
		 // Function handling the path selection. Receives the selected path as argument.
		 // Required
    onConfirm: PropTypes.func,

    // Information about the item to download
    title: PropTypes.node,

    initialPath: PropTypes.string,
  };*/

  /*static defaultProps: Pick<FilePreviewDialogProps, 'title' | 'initialPath'> = {
    title: 'Browse...',
    initialPath: '',
  };*/

  /*state = {
    currentPath: this.props.initialPath,
  };

  onDirectoryChanged = (path: string) => {
    this.setState({ 
      currentPath: path 
    });
  }*/


  preview: string;

  constructor(props: FilePreviewDialogProps /*& ModalRouteDecoratorChildProps*/) {
    super(props);

    this.preview = URL.createObjectURL(props.file);
  }

  onConfirm = () => {
    const { file, onConfirm } = this.props;
    return onConfirm(file);
  }

  componentWillUnmount() {
    URL.revokeObjectURL(this.preview);
  }

  render() {
    //const { currentPath } = this.state;
    //const { title, initialPath, historyId } = this.props;

    const { file } = this.props;
    const isImage = file.type.startsWith('image');
    return (
      <Modal
        { ...this.props }
        className="file-preview-dialog"
        //title={ title }
        onApprove={ this.onConfirm }
        closable={ true }
        fullHeight={ true }
        //approveDisabled={ currentPath.length === 0 }
        approveCaption="Upload"
        icon={ IconConstants.UPLOAD }
      >
        { isImage && (
          <img 
            key={ file.name } 
            alt={ file.name }
            src={ this.preview }
            style={{
              maxWidth: '100%',
              maxHeight: '100%',
            }}
          />
        ) }

        <div>
          { file.name }
        </div>
      </Modal>
    );
  }
}

/*export default ModalRouteDecorator<FilePreviewDialogProps>(
  FilePreviewDialog,
  'file-preview'
);*/

export default FilePreviewDialog;