import React from 'react';
import ProtocolPage from 'routes/Settings/routes/Connectivity/components/ProtocolPage';

import { SettingSectionChildProps } from 'routes/Settings/components/SettingSection';


const Entry = [
  'connection_auto_v6',
  'connection_bind_v6',
  'connection_mode_v6',
  'connection_ip_v6',
  'connection_update_ip_v6',
  'connection_ip_override_v6',
];

const IPv6: React.FC<SettingSectionChildProps> = props => (
  <div>
    <ProtocolPage
      { ...props }
      keys={ Entry }
      protocol="v6"
    />
  </div>
);

export default IPv6;