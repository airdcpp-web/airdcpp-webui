import * as React from 'react';
import RemoteSettingForm from '@/routes/Settings/components/RemoteSettingForm';
import { SettingPageProps } from '@/routes/Settings/types';

const Entry = [
  'always_ccpm',
  'tls_mode',
  'tls_allow_untrusted_clients',
  'tls_allow_untrusted_hubs',
];

const Encryption: React.FC<SettingPageProps> = () => (
  <div>
    <RemoteSettingForm keys={Entry} />
  </div>
);

export default Encryption;
