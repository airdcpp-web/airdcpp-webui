import React from 'react';
import RemoteSettingForm from 'routes/Settings/components/RemoteSettingForm';

import HashDatabaseLayout from 'routes/Settings/routes/Sharing/components/HashDatabaseLayout';
import { SettingSectionChildProps } from 'routes/Settings/components/SettingSection';

const Entry = [
  'max_hash_speed',
  'max_total_hashers',
  'max_volume_hashers',
];

const HashingPage: React.FC<SettingSectionChildProps> = props => (
  <div>
    <RemoteSettingForm
      { ...props }
      keys={ Entry }
    />

    <HashDatabaseLayout
      settingsT={ props.settingsT }
    />
  </div>
);

export default HashingPage;