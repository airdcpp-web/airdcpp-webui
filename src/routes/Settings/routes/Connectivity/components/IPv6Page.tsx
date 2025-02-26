import * as React from 'react';
import ProtocolPage from '@/routes/Settings/routes/Connectivity/components/ProtocolPage';
import { SettingPageProps } from '@/routes/Settings/types';

const Entry = [
  'connection_auto_v6',
  'connection_bind_v6',
  'connection_mode_v6',
  'connection_ip_v6',
  'connection_update_ip_v6',
  'connection_ip_override_v6',
];

const IPv6: React.FC<SettingPageProps> = ({ moduleT }) => (
  <div>
    <ProtocolPage keys={Entry} moduleT={moduleT} protocol="v6" />
  </div>
);

export default IPv6;
