import * as React from 'react';
import RemoteSettingForm from 'routes/Settings/components/RemoteSettingForm';
import { SettingPageProps } from 'routes/Settings/types';

const Entry = [
  'refresh_time',
  'refresh_time_incoming',
  'refresh_startup',
  'refresh_threading',
];

const RefreshOptionsPage: React.FC<SettingPageProps> = () => (
  <div>
    <RemoteSettingForm keys={Entry} />
  </div>
);

export default RefreshOptionsPage;
