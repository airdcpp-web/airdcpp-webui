import React from 'react';
import RemoteSettingForm from 'routes/Settings/components/RemoteSettingForm';
import { SettingSectionChildProps } from 'routes/Settings/components/SettingSection';
import { FormFieldSettingHandler } from 'components/form/Form';
import { toFormI18nKey } from 'utils/FormUtils';

import * as UI from 'types/ui';


const Entry = [
  'tcp_port',
  'udp_port',
  'tls_port',
  'preferred_port_mapper',
];

const FieldOptionGetter = (moduleT: UI.ModuleTranslator) => {
  const onFieldSetting: FormFieldSettingHandler = (id, fieldOptions, formValue) => {
    const translate = (text: string) => {
      return moduleT.t(
        toFormI18nKey(UI.TranslatableFormDefinitionProperties.HELP, id, undefined),
        text
      );
    };

    if (id === 'tcp_port') {
      fieldOptions['help'] = translate('TCP port is used for unencrypted transfers');
    } else if (id === 'tls_port') {
      fieldOptions['help'] = translate('TLS port (TCP) is used for encrypted transfers');
    } else if (id === 'udp_port') {
      fieldOptions['help'] = translate('UDP port is used for searching');
    }
  };

  return onFieldSetting;
};

const PortsPage: React.FC<SettingSectionChildProps> = props => (
  <div>
    <RemoteSettingForm
      { ...props }
      keys={ Entry }
      onFieldSetting={ FieldOptionGetter(props.moduleT) }
    />
  </div>
);

export default PortsPage;