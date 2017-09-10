import React from 'react';
import RemoteSettingForm from 'routes/Settings/components/RemoteSettingForm';

import { OutgoingConnectionModeEnum } from 'constants/SettingConstants';


const Entry = [
  'outgoing_mode',
  'socks_server',
  'socks_port',
  'socks_resolve',
  'socks_user',
  'socks_password',
  'http_proxy',
];

const onFieldSetting = (id, fieldOptions, formValue) => {
  const socksEnabled = formValue.outgoing_mode === OutgoingConnectionModeEnum.OUTGOING_SOCKS;

  if (!socksEnabled && id.indexOf('socks_') === 0) {
    fieldOptions['disabled'] = true;
  }
};

const Encryption = props => (
  <div>
    <RemoteSettingForm
      { ...props }
      keys={ Entry }
      onFieldSetting={ onFieldSetting }
    />
  </div>
);

export default Encryption;