import React from 'react';
import Modal from 'components/semantic/Modal';

import ModalRouteDecorator from 'decorators/ModalRouteDecorator';
import OverlayConstants from 'constants/OverlayConstants';

import FileIcon from 'components/icon/FileIcon';
import BundleFileTable from './BundleFileTable';


class BundleFileDialog extends React.Component {
  static displayName = 'BundleFileDialog';

  render() {
    const { bundle } = this.props;
    return (
      <Modal 
        className="source" 
        title={ bundle.name }
        closable={ true } 
        icon={ <FileIcon typeInfo={ bundle.type }/> } 
        fullHeight={ true }
        {...this.props}
      >
        <BundleFileTable 
          bundle={ bundle }
        />
      </Modal>
    );
  }
}

export default ModalRouteDecorator(BundleFileDialog, OverlayConstants.BUNDLE_CONTENT_MODAL, 'content');