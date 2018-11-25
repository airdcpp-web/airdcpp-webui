import React from 'react';

import ActionButton from 'components/ActionButton';
import DataProviderDecorator, { DataProviderDecoratorChildProps } from 'decorators/DataProviderDecorator';

import ConnectivityActions from 'actions/ConnectivityActions';
import ConnectivityConstants from 'constants/ConnectivityConstants';

import { Row } from 'components/semantic/Grid';

import '../style.css';

import * as API from 'types/api';


const formatStatus = (protocolStatus: API.ConnectivityProtocolStatus, running: boolean) => {
  if (running) {
    return 'Detecting...';
  }

  let ret = protocolStatus.text;
  if (protocolStatus.auto_detect) {
    ret += ' (auto detected)';
  } else {
    ret += ' (manual configuration)';
  }

  return ret;
};


interface DetectPanelProps {

}

interface DetectPanelDataProps extends DataProviderDecoratorChildProps {
  status: API.ConnectivityStatus;
  runningV4: boolean;
  runningV6: boolean;
}

const DetectPanel: React.FC<DetectPanelProps & DetectPanelDataProps> = (
  { status, runningV4, runningV6 }
) => (
  <div className="ui segment detect-panel">
    <h3 className="header">Current auto detection status</h3>
    <div className="ui grid two column">
      <Row title="IPv4 connectivity" text={ formatStatus(status.status_v4, runningV4) }/>
      <Row title="IPv6 connectivity" text={ formatStatus(status.status_v6, runningV6) }/>
    </div>
    <ActionButton 
      className="detect-button"
      action={ ConnectivityActions.detect }
      disabled={ !status.status_v4.auto_detect && !status.status_v6.auto_detect }
      loading={ runningV6 || runningV4 } 
    />
  </div>
);

export default DataProviderDecorator(DetectPanel, {
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