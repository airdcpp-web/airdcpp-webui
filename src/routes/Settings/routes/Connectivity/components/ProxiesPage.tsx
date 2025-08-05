import * as React from 'react';
import RemoteSettingForm from '@/routes/Settings/components/RemoteSettingForm';

import { OutgoingConnectionModeEnum } from '@/constants/SettingConstants';
import { SettingPageProps } from '@/routes/Settings/types';
import { FormFieldSettingHandler } from '@/components/form/Form';

const Entry = [
  'outgoing_mode',
  'socks_server',
  'socks_port',
  'socks_resolve',
  'socks_user',
  'socks_password',
  'http_proxy',
];

const onFieldSetting: FormFieldSettingHandler = (id, fieldOptions, formValue) => {
  const socksEnabled =
    formValue.outgoing_mode === OutgoingConnectionModeEnum.OUTGOING_SOCKS;

  if (!socksEnabled && id.indexOf('socks_') === 0) {
    fieldOptions.disabled = true;
  }
};

const ProxiesPage: React.FC<SettingPageProps> = () => (
  <div>
    <RemoteSettingForm keys={Entry} onFieldSetting={onFieldSetting} />
  </div>
);

export default ProxiesPage;
