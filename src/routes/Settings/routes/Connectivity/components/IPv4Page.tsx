import * as React from 'react';
import ProtocolPage from 'routes/Settings/routes/Connectivity/components/ProtocolPage';
import { SettingPageProps } from 'routes/Settings/types';

const Entry = [
  'connection_auto_v4',
  'connection_bind_v4',
  'connection_mode_v4',
  'connection_ip_v4',
  'connection_update_ip_v4',
  'connection_ip_override_v4',
];

const IPv4: React.FC<SettingPageProps> = ({ moduleT }) => (
  <div>
    <ProtocolPage moduleT={moduleT} keys={Entry} protocol="v4" />
  </div>
);

export default IPv4;
