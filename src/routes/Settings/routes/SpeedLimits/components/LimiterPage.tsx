import * as React from 'react';
import RemoteSettingForm from 'routes/Settings/components/RemoteSettingForm';
import { SettingPageProps } from 'routes/Settings/types';

const Entry = ['upload_limit_main', 'download_limit_main'];

const LimiterPage: React.FC<SettingPageProps> = () => (
  <div>
    <RemoteSettingForm keys={Entry} />
  </div>
);

export default LimiterPage;
