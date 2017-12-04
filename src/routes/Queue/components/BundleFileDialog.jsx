import React from 'react';
import createReactClass from 'create-react-class';
import Modal from 'components/semantic/Modal';

import FileIcon from 'components/icon/FileIcon';
import BundleFileTable from './BundleFileTable';


const BundleFileDialog = createReactClass({
  displayName: 'BundleFileDialog',

  render: function () {
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
  },
});

export default BundleFileDialog;