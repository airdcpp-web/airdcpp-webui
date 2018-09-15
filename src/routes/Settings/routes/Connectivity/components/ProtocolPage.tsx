import React from 'react';
import RemoteSettingForm from 'routes/Settings/components/RemoteSettingForm';

import { IncomingConnectionModeEnum } from 'constants/SettingConstants';
import { FormFieldSettingHandler } from 'components/form/Form';
import { SettingSectionChildProps } from 'routes/Settings/components/SettingSection';


interface ProtocolPageProps extends SettingSectionChildProps {
  protocol: string;
  keys: string[];
}

class ProtocolPage extends React.Component<ProtocolPageProps> {
  convertValue = (key: string) => {
    return key + '_' + this.props.protocol;
  }

  onFieldSetting: FormFieldSettingHandler<any> = (id, fieldOptions, formValue) => {
    const protocolEnabled = formValue[this.convertValue('connection_mode')] !== 
      IncomingConnectionModeEnum.INCOMING_DISABLED;
    const autoDetect = formValue[this.convertValue('connection_auto')];

    if ((!protocolEnabled || autoDetect) && (
      id.indexOf('connection_ip') === 0 || id.indexOf('connection_bind') === 0 ||
      id.indexOf('connection_update_ip') === 0 || id.indexOf('connection_ip_override') === 0)
    ) {
      fieldOptions['disabled'] = true;
    }

    if (autoDetect && id.indexOf('connection_mode') === 0 && protocolEnabled) {
      fieldOptions['disabled'] = true;
    }

    if (!protocolEnabled && id.indexOf('connection_auto') === 0) {
      fieldOptions['disabled'] = true;
    }
  }

  render() {
    return (
      <div>
        <RemoteSettingForm
          { ...this.props }
          onFieldSetting={ this.onFieldSetting }
        />
      </div>
    );
  }
}

export default ProtocolPage;