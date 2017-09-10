import React from 'react';

import Loader from 'components/semantic/Loader';


const getMessage = (lastError) => {
  if (lastError !== null) {
    return lastError + '. Attempting to re-establish connection...';
  }
		
  return 'Connecting to the server...';
};

const SocketConnectStatus = ({ lastError, active, ...props }) => (
  <div className={ 'ui dimmer page visible ' + (active ? 'active' : '')}>
    <div className="content">
      <div className="center">
        <Loader text={ getMessage(lastError) }/>
      </div>
    </div>
  </div>
);

export default SocketConnectStatus;