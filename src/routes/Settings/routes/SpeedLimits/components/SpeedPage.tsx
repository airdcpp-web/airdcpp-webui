import * as React from 'react';

import ExternalLink from '@/components/ExternalLink';
import LinkConstants from '@/constants/LinkConstants';

import RemoteSettingForm from '@/routes/Settings/components/RemoteSettingForm';
import { SettingPageProps } from '@/routes/Settings/types';
import { Trans } from 'react-i18next';

const Entry = ['download_speed', 'upload_speed'];

const SpeedPage: React.FC<SettingPageProps> = ({ moduleT }) => {
  const { toI18nKey } = moduleT;
  const defaults =
    'Please be as accurate as possible and set the ACTUAL speed of your connection. \
You may use an online tester, such as <speedtest>{{name}}</speedtest>, to test your speed.';

  return (
    <div>
      <div className="ui message">
        <Trans
          i18nKey={toI18nKey('connectionSpeedNote')}
          defaults={defaults}
          values={{ name: 'Speedtest.net' }}
          components={{
            speedtest: <ExternalLink url={LinkConstants.SPEEDTEST_URL} />,
          }}
        />
      </div>
      <RemoteSettingForm keys={Entry} />
    </div>
  );
};

export default SpeedPage;
