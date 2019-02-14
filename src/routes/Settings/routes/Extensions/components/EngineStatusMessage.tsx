import React from 'react';

import ExtensionConstants from 'constants/ExtensionConstants';
import LinkConstants from 'constants/LinkConstants';
import DataProviderDecorator, { DataProviderDecoratorChildProps } from 'decorators/DataProviderDecorator';

import ExternalLink from 'components/ExternalLink';
import Message from 'components/semantic/Message';

import * as API from 'types/api';
import * as UI from 'types/ui';

import { Trans } from 'react-i18next';


interface EngineStatusMessageProps {
  settingsT: UI.ModuleTranslator;
}

interface EngineStatusMessageDataProps extends DataProviderDecoratorChildProps {
  enginesStatus: API.ExtensionEngineStatus;
}

// Show an info message if the default extension engine is not installed
const EngineStatusMessage: React.FC<EngineStatusMessageProps & EngineStatusMessageDataProps> = (
  { enginesStatus, settingsT }
) => {
  if (enginesStatus[ExtensionConstants.DEFAULT_ENGINE]) {
    return null;
  }

  return (
    <Message 
      description={
        <Trans i18nKey={ settingsT.toI18nKey('defaultExtensionEngineMissing') }>
          The default extension engine <b>{ ExtensionConstants.DEFAULT_ENGINE }</b> is not installed on your system. 
          Please visit <ExternalLink url={ LinkConstants.DEFAULT_ENGINE_URL }>engine's home page</ExternalLink> for 
          installation instructions.
        </Trans>
      }
      icon="yellow warning"
    />
  );
};

export default DataProviderDecorator<EngineStatusMessageProps, EngineStatusMessageDataProps>(EngineStatusMessage, {
  urls: {
    enginesStatus: ExtensionConstants.ENGINES_STATUS_URL,
  },
});