import React from 'react';

import Loader from 'components/semantic/Loader';


interface SocketConnectStatusProps {
  message: string;
}

const SocketConnectStatus: React.FC<SocketConnectStatusProps> = (
  { message }
) => (
  <div className="ui dimmer page visible active">
    <div className="content">
      <div className="center">
        <Loader text={ message }/>
      </div>
    </div>
  </div>
);

export default SocketConnectStatus;