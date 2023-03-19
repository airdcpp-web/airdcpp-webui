import * as React from 'react';

import ExternalLink from 'components/ExternalLink';
import LinkConstants from 'constants/LinkConstants';

import RemoteSettingForm from 'routes/Settings/components/RemoteSettingForm';
import { SettingSectionChildProps } from 'routes/Settings/components/SettingSection';
import { Trans } from 'react-i18next';

const Entry = ['download_speed', 'upload_speed'];

const SpeedPage: React.FC<SettingSectionChildProps> = (props) => {
  const { toI18nKey } = props.moduleT;
  return (
    <div>
      <div className="ui message">
        <Trans i18nKey={toI18nKey('connectionSpeedNote')}>
          Please be as accurate as possible and set the ACTUAL speed of your connection.
          You may use an online tester, such as{' '}
          <ExternalLink url={LinkConstants.SPEEDTEST_URL}>Speedtest.net</ExternalLink>, to
          test your speed.
        </Trans>
      </div>
      <RemoteSettingForm {...props} keys={Entry} />
    </div>
  );
};

export default SpeedPage;
