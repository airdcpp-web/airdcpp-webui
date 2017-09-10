import React from 'react';
import createReactClass from 'create-react-class';
import Modal from 'components/semantic/Modal';

import { LocationContext, RouteContext } from 'mixins/RouterMixin';

import FileIcon from 'components/icon/FileIcon';

import SourceTable from './SourceTable';


const SourceDialog = createReactClass({
  displayName: 'SourceDialog',
  mixins: [ LocationContext, RouteContext ],

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
        <SourceTable 
          bundle={ bundle }
        />
      </Modal>
    );
  },
});

export default SourceDialog;