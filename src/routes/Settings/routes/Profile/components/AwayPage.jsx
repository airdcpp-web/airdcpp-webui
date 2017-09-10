import React from 'react';
import RemoteSettingForm from 'routes/Settings/components/RemoteSettingForm';

const Entry = [
  'away_message',
  'away_no_bots',
  'away_idle_time',
];

const AwayPage = props => (
  <div>
    <RemoteSettingForm
      { ...props }
      keys={ Entry }
    />
  </div>
);

export default AwayPage;