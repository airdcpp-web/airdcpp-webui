import React from 'react';

import ActionButton from 'components/ActionButton';
import DataProviderDecorator, { DataProviderDecoratorChildProps } from 'decorators/DataProviderDecorator';

import ConnectivityActions from 'actions/ui/ConnectivityActions';
import ConnectivityConstants from 'constants/ConnectivityConstants';

import { Row } from 'components/semantic/Grid';

import '../style.css';

import * as API from 'types/api';
import * as UI from 'types/ui';


const formatStatus = (
  protocolStatus: API.ConnectivityProtocolStatus, 
  running: boolean,
  moduleT: UI.ModuleTranslator
) => {
  const { translate, t } = moduleT;
  if (running) {
    return translate('Detecting...');
  }

  const auto = protocolStatus.auto_detect;
  const ret = t(auto ? 'autoDetected' : 'manualConfiguration', {
    defaultValue: auto ? '{{status}} (auto detected)' : '{{status}} (manual configuration)',
    replace: {
      status: protocolStatus.text
    }
  });

  return ret;
};


interface DetectPanelProps {
  moduleT: UI.ModuleTranslator;
}

interface DetectPanelDataProps extends DataProviderDecoratorChildProps {
  status: API.ConnectivityStatus;
  runningV4: boolean;
  runningV6: boolean;
}

const DetectPanel: React.FC<DetectPanelProps & DetectPanelDataProps> = (
  { status, runningV4, runningV6, moduleT }
) => (
  <div className="ui segment detect-panel">
    <h3 className="header">
      { moduleT.translate('Current auto detection status') }
    </h3>
    <div className="ui grid two column">
      <Row 
        title={ moduleT.translate('IPv4 connectivity') } 
        text={ formatStatus(status.status_v4, runningV4, moduleT) }
      />
      <Row 
        title={ moduleT.translate('IPv6 connectivity') } 
        text={ formatStatus(status.status_v6, runningV6, moduleT) }
      />
    </div>
    <ActionButton 
      className="detect-button"
      actions={ ConnectivityActions }
      actionId="detect"
      disabled={ !status.status_v4.auto_detect && !status.status_v6.auto_detect }
      loading={ runningV6 || runningV4 } 
    />
  </div>
);

export default DataProviderDecorator<DetectPanelProps, DetectPanelDataProps>(DetectPanel, {
  urls: {
    status: ConnectivityConstants.STATUS_URL,
  },
  onSocketConnected: (addSocketListener, { refetchData, mergeData }) => {
    const setDetectState = (v6: boolean, running: boolean) => {
      const value = 'running' + (v6 ? 'V6' : 'V4');
      mergeData({ 
        [value]: running,
      });
    };

    addSocketListener(
      ConnectivityConstants.MODULE_URL, 
      ConnectivityConstants.CONNECTIVITY_STARTED, 
      (data: API.ConnectivityDetectionStarted) => {
        setDetectState(data.v6, true);
      }
    );

    addSocketListener(
      ConnectivityConstants.MODULE_URL, 
      ConnectivityConstants.CONNECTIVITY_FINISHED, 
      (data: API.ConnectivityDetectionFinished) => {
        setDetectState(data.v6, false);
        refetchData();
      }
    );
  },
});