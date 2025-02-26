import * as React from 'react';
import RemoteSettingForm from '@/routes/Settings/components/RemoteSettingForm';

import HashDatabaseLayout from '@/routes/Settings/routes/Sharing/components/HashDatabaseLayout';
import { SettingPageProps } from '@/routes/Settings/types';

const Entry = ['max_hash_speed', 'max_total_hashers', 'max_volume_hashers'];

const HashingPage: React.FC<SettingPageProps> = ({ moduleT }) => (
  <div>
    <RemoteSettingForm keys={Entry} />

    <HashDatabaseLayout moduleT={moduleT} />
  </div>
);

export default HashingPage;
