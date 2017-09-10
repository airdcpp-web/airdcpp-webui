import React from 'react';

import ExternalLink from 'components/ExternalLink';
import LinkConstants from 'constants/LinkConstants';

import RemoteSettingForm from 'routes/Settings/components/RemoteSettingForm';


const Entry = [
  'download_speed',
  'upload_speed',
];

const SpeedPage = props => (
  <div>
    <div className="ui message">
			Please be as accurate as possible and set the ACTUAL speed of your connection. You may use an online tester, 
			such as <ExternalLink url={ LinkConstants.SPEEDTEST_URL }>Speedtest.net</ExternalLink>, to test your speed.
    </div>
    <RemoteSettingForm
      { ...props }
      keys={ Entry }
    />
  </div>
);

export default SpeedPage;