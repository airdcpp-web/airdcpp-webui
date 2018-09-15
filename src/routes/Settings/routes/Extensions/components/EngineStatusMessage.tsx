import React from 'react';

import ExtensionConstants from 'constants/ExtensionConstants';
import LinkConstants from 'constants/LinkConstants';
import DataProviderDecorator, { DataProviderDecoratorChildProps } from 'decorators/DataProviderDecorator';

import ExternalLink from 'components/ExternalLink';
import Message from 'components/semantic/Message';


interface EngineStatusMessageProps {

}

interface EngineStatusMessageDataProps extends DataProviderDecoratorChildProps {
  enginesStatus: API.ExtensionEngineStatus;
}

// Show an info message if the default extension engine is not installed
const EngineStatusMessage: React.SFC<EngineStatusMessageProps & EngineStatusMessageDataProps> = ({ enginesStatus }) => {
  if (enginesStatus[ExtensionConstants.DEFAULT_ENGINE]) {
    return null;
  }

  return (
    <Message 
      description={
        <span>
          The default extension engine <b>{ ExtensionConstants.DEFAULT_ENGINE }</b> is not installed on your system. 
          Please visit <ExternalLink url={ LinkConstants.DEFAULT_ENGINE_URL }>engine's home page</ExternalLink> 
          for installation instructions.
        </span>
      }
      icon="yellow warning"
    />
  );
};

export default DataProviderDecorator(EngineStatusMessage, {
  urls: {
    enginesStatus: ExtensionConstants.ENGINES_STATUS_URL,
  },
});