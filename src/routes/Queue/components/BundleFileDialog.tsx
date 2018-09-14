import React from 'react';
import Modal from 'components/semantic/Modal';

import ModalRouteDecorator from 'decorators/ModalRouteDecorator';
import OverlayConstants from 'constants/OverlayConstants';

import FileIcon from 'components/icon/FileIcon';
import BundleFileTable from 'routes/Queue/components/BundleFileTable';


interface BundleFileDialogProps {
  bundle?: API.QueueBundle; // REQUIRED, CLONED
}

class BundleFileDialog extends React.Component<BundleFileDialogProps> {
  static displayName = 'BundleFileDialog';

  render() {
    const { bundle, ...other } = this.props;
    return (
      <Modal 
        className="source" 
        title={ bundle!.name }
        closable={ true } 
        icon={ <FileIcon typeInfo={ bundle!.type }/> } 
        fullHeight={ true }
        { ...other }
      >
        <BundleFileTable 
          bundle={ bundle! }
        />
      </Modal>
    );
  }
}

export default ModalRouteDecorator(BundleFileDialog, OverlayConstants.BUNDLE_CONTENT_MODAL, 'content');