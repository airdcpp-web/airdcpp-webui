import * as React from 'react';

import DetectPanel from 'routes/Settings/routes/Connectivity/components/DetectPanel';

import ExternalLink from 'components/ExternalLink';
import LinkConstants from 'constants/LinkConstants';
import Message from 'components/semantic/Message';
import { Trans } from 'react-i18next';
import { SettingSectionChildProps } from 'routes/Settings/components/SettingSection';
import IconConstants from 'constants/IconConstants';

const DetectionPage: React.FC<SettingSectionChildProps> = (props) => {
  const { toI18nKey } = props.moduleT;
  return (
    <div>
      <DetectPanel moduleT={props.moduleT} />
      <Message
        description={
          <Trans i18nKey={toI18nKey('connectivityDetectionNote')}>
            In case of file transfer connectivity issues, please confirm that your TCP
            ports are really open by using{' '}
            <ExternalLink url={LinkConstants.PORTCHECK_URL}>
              an online port checker
            </ExternalLink>
            . Note that validity of the UDP port (search) can't be checked online. For
            more information about different connectivity modes, please visit{' '}
            <ExternalLink url={LinkConstants.CONNECTIVITY_HELP_URL}>
              DC++'s connectivity FAQ
            </ExternalLink>
            .
          </Trans>
        }
        icon={IconConstants.INFO}
      />
    </div>
  );
};

export default DetectionPage;
