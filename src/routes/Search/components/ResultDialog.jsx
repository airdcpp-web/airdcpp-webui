import React from 'react';
import createReactClass from 'create-react-class';
import Modal from 'components/semantic/Modal';

import { LocationContext } from 'mixins/RouterMixin';

import FileIcon from 'components/icon/FileIcon';

import ResultInfoGrid from './ResultInfoGrid';
import UserResultTable from './UserResultTable';


const ResultDialog = createReactClass({
  displayName: 'ResultDialog',
  mixins: [ LocationContext ],

  render: function () {
    const { parentResult } = this.props;
    return (
      <Modal 
        className="result" 
        title={ parentResult.name }
        closable={ true } 
        icon={ <FileIcon typeInfo={ parentResult.type }/> } 
        fullHeight={ true }
        {...this.props}
      >
        <ResultInfoGrid parentResult={ parentResult }/>
        <UserResultTable parentResult={ parentResult }/>
      </Modal>
    );
  },
});

export default ResultDialog;