import React from 'react';
import SocketService from 'services/SocketService';
import DataProviderDecorator from 'decorators/DataProviderDecorator';

import Checkbox from 'components/semantic/Checkbox';
import Button from 'components/semantic/Button';
import Message from 'components/semantic/Message';

import HashConstants from 'constants/HashConstants';
import AccessConstants from 'constants/AccessConstants';
import LoginStore from 'stores/LoginStore';

import { formatSize } from 'utils/ValueFormat';

import '../style.css';


const OptimizeLayout = ({ startHandler, checkboxState, checkboxHandler, running }) => (
  <div className="optimize-layout">
    <h4 className="header">Maintenance</h4>
    <Message 
      description="This operation will delete all hash information for files that aren't currently in share. If you are sharing files from network disks or from a removable storage, make sure that the files are currently shown in share (otherwise they have to be rehashed)"
      icon="blue warning"
    />

    <Checkbox 
      caption="Verify integrity of hash data" 
      checked={ checkboxState } 
      disabled={ running }
      onChange={ checkboxHandler }
      floating={ true }
    />
    <Button 
      className="optimize-button"
      caption="Optimize now"
      icon="gray configure"
      loading={ running } 
      onClick={ startHandler }
    />
  </div>
);

const SizeRow = ({ title, size }) => (
  <div className="ui row compact">
    <div className="three wide column">
      <div className="ui tiny header">
        { title }
      </div>
    </div>
    <div className="twelve wide column">
      { formatSize(size) }
    </div>
  </div>
);

class HashDatabaseLayout extends React.Component {
  state = {
    verify: false,
  };

  handleOptimize = () => {
    SocketService.post(HashConstants.OPTIMIZE_DATABASE_URL, { verify: this.state.verify })
      .catch(error => 
        console.error('Failed to optimize database: ' + error)
      );
  };

  render() {
    const { status } = this.props;
    return (
      <div className="ui segment hash-database">
        <h3 className="header">Hash database</h3>
        <div className="ui grid two column">
          <SizeRow title="File index size" size={ status.file_index_size }/>
          <SizeRow title="Hash store size" size={ status.hash_store_size }/>
        </div>
        { LoginStore.hasAccess(AccessConstants.SETTINGS_EDIT) && (
          <OptimizeLayout
            running={ status.maintenance_running }
            startHandler={ this.handleOptimize }
            checkboxState={ this.state.verify }
            checkboxHandler={ (checked) => this.setState({ verify: checked }) }
          /> 
        ) }
      </div>
    );
  }
}

export default DataProviderDecorator(HashDatabaseLayout, {
  urls: {
    status: HashConstants.DATABASE_STATUS_URL,
  },
  onSocketConnected: (addSocketListener, { refetchData }) => {
    addSocketListener(HashConstants.MODULE_URL, HashConstants.DATABASE_STATUS, _ => refetchData());
  },
});