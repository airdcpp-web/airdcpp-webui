import * as React from 'react';

import Loader from 'components/semantic/Loader';

interface SocketConnectStatusProps {
  message: string;
}

const SocketConnectStatus: React.FC<SocketConnectStatusProps> = ({ message }) => (
  <Loader fullPage={true} text={message} />
);

export default SocketConnectStatus;
