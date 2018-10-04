import React from 'react';
import SocketService from 'services/SocketService';
import DataProviderDecorator, { DataProviderDecoratorChildProps } from 'decorators/DataProviderDecorator';

import Checkbox from 'components/semantic/Checkbox';
import Button from 'components/semantic/Button';
import Message from 'components/semantic/Message';

import HashConstants from 'constants/HashConstants';
import LoginStore from 'stores/LoginStore';

import { formatSize } from 'utils/ValueFormat';

import '../style.css';

import * as API from 'types/api';
import { ErrorResponse } from 'airdcpp-apisocket';


interface OptimizeLayoutProps {
  checkboxHandler: (checked: boolean) => void;
  running: boolean;
  checkboxState: boolean;
  startHandler: () => void;
}

const OptimizeLayout: React.SFC<OptimizeLayoutProps> = (
  { startHandler, checkboxState, checkboxHandler, running }
) => (
  <div className="optimize-layout">
    <h4 className="header">Maintenance</h4>
    <Message 
      // tslint:disable-next-line:max-line-length
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


interface SizeRowProps {
  title: string;
  size: number;
}

const SizeRow: React.SFC<SizeRowProps> = ({ title, size }) => (
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

interface HashDatabaseLayoutDataProps extends DataProviderDecoratorChildProps {
  status: API.HashDatabaseStatus;
}

class HashDatabaseLayout extends React.Component<HashDatabaseLayoutDataProps> {
  state = {
    verify: false,
  };

  handleOptimize = () => {
    SocketService.post(HashConstants.OPTIMIZE_DATABASE_URL, { verify: this.state.verify })
      .catch((error: ErrorResponse) => 
        console.error(`Failed to optimize database: ${error}`)
      );
  }

  render() {
    const { status } = this.props;
    return (
      <div className="ui segment hash-database">
        <h3 className="header">Hash database</h3>
        <div className="ui grid two column">
          <SizeRow title="File index size" size={ status.file_index_size }/>
          <SizeRow title="Hash store size" size={ status.hash_store_size }/>
        </div>
        { LoginStore.hasAccess(API.AccessEnum.SETTINGS_EDIT) && (
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
    addSocketListener(HashConstants.MODULE_URL, HashConstants.DATABASE_STATUS, () => refetchData());
  },
});