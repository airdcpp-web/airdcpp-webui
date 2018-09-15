import React from 'react';

import Loader from 'components/semantic/Loader';


const getMessage = (lastError: string) => {
  if (!!lastError) {
    return lastError + '. Attempting to re-establish connection...';
  }

  return 'Connecting to the server...';
};

interface SocketConnectStatusProps {
  lastError: string;
  active: boolean;
}

const SocketConnectStatus: React.SFC<SocketConnectStatusProps> = (
  { lastError, active }
) => (
  <div className={ 'ui dimmer page visible ' + (active ? 'active' : '')}>
    <div className="content">
      <div className="center">
        <Loader text={ getMessage(lastError) }/>
      </div>
    </div>
  </div>
);

export default SocketConnectStatus;