import React from 'react';
import Modal from 'components/semantic/Modal';

import ModalRouteDecorator from 'decorators/ModalRouteDecorator';
import OverlayConstants from 'constants/OverlayConstants';

import FileIcon from 'components/icon/FileIcon';

import SourceTable from 'routes/Queue/components/BundleSourceTable';


interface BundleSourceDialogProps {
  bundle?: API.QueueBundle; // REQUIRED, CLONED
}

class SourceDialog extends React.Component<BundleSourceDialogProps> {
  static displayName = 'SourceDialog';

  render() {
    const { bundle } = this.props;
    return (
      <Modal 
        className="source" 
        title={ bundle!.name }
        closable={ true } 
        icon={ <FileIcon typeInfo={ bundle!.type }/> } 
        fullHeight={ true }
        {...this.props}
      >
        <SourceTable 
          bundle={ bundle }
        />
      </Modal>
    );
  }
}

export default ModalRouteDecorator(SourceDialog, OverlayConstants.BUNDLE_SOURCE_MODAL, 'sources');