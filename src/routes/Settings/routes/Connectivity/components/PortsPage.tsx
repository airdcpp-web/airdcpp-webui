import React from 'react';
import RemoteSettingForm from 'routes/Settings/components/RemoteSettingForm';
import { SettingSectionChildProps } from 'routes/Settings/components/SettingSection';
import { FormFieldSettingHandler } from 'components/form/Form';

const Entry = [
  'tcp_port',
  'udp_port',
  'tls_port',
  'preferred_port_mapper',
];

const onFieldSetting: FormFieldSettingHandler<any> = (id, fieldOptions, formValue) => {
  if (id === 'tcp_port') {
    fieldOptions['help'] = 'TCP port is used for unencrypted transfers';
  } else if (id === 'tls_port') {
    fieldOptions['help'] = 'TLS port (TCP) is used for encrypted transfers';
  } else if (id === 'udp_port') {
    fieldOptions['help'] = 'UDP port is used for searching';
  }
};

const PortsPage: React.SFC<SettingSectionChildProps> = props => (
  <div>
    <RemoteSettingForm
      { ...props }
      keys={ Entry }
      onFieldSetting={ onFieldSetting }
    />
  </div>
);

export default PortsPage;