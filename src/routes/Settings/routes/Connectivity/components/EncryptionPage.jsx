import React from 'react';
import RemoteSettingForm from 'routes/Settings/components/RemoteSettingForm';


const Entry = [
  'always_ccpm',
  'tls_mode',
];

const Encryption = props => (
  <div>
    <RemoteSettingForm
      { ...props }
      keys={ Entry }
    />
  </div>
);

export default Encryption;