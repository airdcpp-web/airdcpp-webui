import React from 'react';
import ProtocolPage from 'routes/Settings/routes/Connectivity/components/ProtocolPage';
import { SettingSectionChildProps } from 'routes/Settings/components/SettingSection';

const Entry = [
  'connection_auto_v4',
  'connection_bind_v4',
  'connection_mode_v4',
  'connection_ip_v4',
  'connection_update_ip_v4',
  'connection_ip_override_v4',
];

const IPv4: React.SFC<SettingSectionChildProps> = props => (
  <div>
    <ProtocolPage
      { ...props }
      keys={ Entry }
      protocol="v4"
    />
  </div>
);

export default IPv4;