import * as React from 'react';

import ActionButton from '@/components/ActionButton';
import DataProviderDecorator, {
  DataProviderDecoratorChildProps,
} from '@/decorators/DataProviderDecorator';

import ConnectivityConstants from '@/constants/ConnectivityConstants';

import { Row, Grid } from '@/components/semantic/Grid';

import '../style.css';

import * as API from '@/types/api';
import * as UI from '@/types/ui';
import {
  ConnectivityActionModule,
  ConnectivityDetectAction,
} from '@/actions/ui/connectivity';
import Button from '@/components/semantic/Button';

const formatProtocolStatus = (
  protocolStatus: API.ConnectivityProtocolStatus,
  running: boolean,
  moduleT: UI.ModuleTranslator,
) => {
  const { translate, t } = moduleT;
  if (running) {
    return translate('Detecting...');
  }

  const auto = protocolStatus.auto_detect;
  const ret = t(auto ? 'autoDetected' : 'manualConfiguration', {
    defaultValue: auto
      ? '{{status}} (auto detected)'
      : '{{status}} (manual configuration)',
    replace: {
      status: protocolStatus.text,
    },
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

const DetectPanel: React.FC<DetectPanelProps & DetectPanelDataProps> = ({
  status,
  runningV4,
  runningV6,
  moduleT,
}) => {
  const [showDetails, setShowDetails] = React.useState(false);
  return (
    <div className="ui segment detect-panel">
      <h3 className="header">{moduleT.translate('Current auto detection status')}</h3>
      <Grid columns="two">
        <Row
          title={moduleT.translate('IPv4 connectivity')}
          text={formatProtocolStatus(status.status_v4, runningV4, moduleT)}
        />
        <Row
          title={moduleT.translate('IPv6 connectivity')}
          text={formatProtocolStatus(status.status_v6, runningV6, moduleT)}
        />
        {showDetails && (
          <>
            <Row
              title={moduleT.translate('Bound interface (IPv4)')}
              text={status.status_v4.bind_address}
            />
            <Row
              title={moduleT.translate('Bound interface (IPv6)')}
              text={status.status_v6.bind_address}
            />
            <Row title={moduleT.translate('Transfer port')} text={status.tcp_port} />
            <Row
              title={moduleT.translate('Encrypted transfer port')}
              text={status.tls_port}
            />
            <Row title={moduleT.translate('Search/UDP port')} text={status.udp_port} />
          </>
        )}
      </Grid>
      <ActionButton
        className="detect-button"
        action={ConnectivityDetectAction}
        moduleData={ConnectivityActionModule}
        disabled={!status.status_v4.auto_detect && !status.status_v6.auto_detect}
        loading={runningV6 || runningV4}
      />
      {!showDetails && (
        <Button
          icon="info"
          caption={moduleT.translate('View all')}
          onClick={() => setShowDetails(!showDetails)}
        />
      )}
    </div>
  );
};

export default DataProviderDecorator<DetectPanelProps, DetectPanelDataProps>(
  DetectPanel,
  {
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

      addSocketListener<API.ConnectivityDetectionStarted>(
        ConnectivityConstants.MODULE_URL,
        ConnectivityConstants.CONNECTIVITY_STARTED,
        (data) => {
          setDetectState(data.v6, true);
        },
      );

      addSocketListener<API.ConnectivityDetectionFinished>(
        ConnectivityConstants.MODULE_URL,
        ConnectivityConstants.CONNECTIVITY_FINISHED,
        (data) => {
          setDetectState(data.v6, false);
          refetchData();
        },
      );
    },
  },
);
