import React from 'react';
import RemoteSettingForm from 'routes/Settings/components/RemoteSettingForm';
import { SettingSectionChildProps } from 'routes/Settings/components/SettingSection';


const Entry = [
  'always_ccpm',
  'tls_mode',
  'tls_allow_untrusted_clients',
  'tls_allow_untrusted_hubs',
];

const Encryption: React.FC<SettingSectionChildProps> = props => (
  <div>
    <RemoteSettingForm
      { ...props }
      keys={ Entry }
    />
  </div>
);

export default Encryption;