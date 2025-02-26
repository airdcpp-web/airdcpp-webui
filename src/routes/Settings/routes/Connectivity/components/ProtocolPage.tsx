import { Component } from 'react';
import RemoteSettingForm, {
  RemoteSettingFormProps,
} from '@/routes/Settings/components/RemoteSettingForm';
import Message from '@/components/semantic/Message';
import IconConstants from '@/constants/IconConstants';

import { IncomingConnectionModeEnum } from '@/constants/SettingConstants';
import { FormFieldSettingHandler } from '@/components/form/Form';

import * as API from '@/types/api';
import * as UI from '@/types/ui';

interface ProtocolPageProps extends RemoteSettingFormProps {
  moduleT: UI.ModuleTranslator;
  protocol: string;
}

class ProtocolPage extends Component<ProtocolPageProps> {
  state = {
    autoDetectEnabled: false,
  };

  convertValue = (key: string) => {
    return `${key}_${this.props.protocol}`;
  };

  onFieldSetting: FormFieldSettingHandler = (id, fieldOptions, formValue) => {
    const protocolEnabled =
      formValue[this.convertValue('connection_mode')] !==
      IncomingConnectionModeEnum.INCOMING_DISABLED;
    const autoDetect = formValue[this.convertValue('connection_auto')];

    if (
      (!protocolEnabled || autoDetect) &&
      (id.indexOf('connection_ip') === 0 ||
        id.indexOf('connection_bind') === 0 ||
        id.indexOf('connection_update_ip') === 0 ||
        id.indexOf('connection_ip_override') === 0)
    ) {
      fieldOptions.disabled = true;
    }

    if (autoDetect && id.indexOf('connection_mode') === 0 && protocolEnabled) {
      fieldOptions.disabled = true;
    }

    if (!protocolEnabled && id.indexOf('connection_auto') === 0) {
      fieldOptions.disabled = true;
    }
  };

  onSettingValuesReceived = (settings: API.SettingValueMap) => {
    this.setState({
      autoDetectEnabled: settings[this.convertValue('connection_auto')],
    });
  };

  render() {
    return (
      <div>
        {this.state.autoDetectEnabled && (
          <Message
            description={this.props.moduleT.t(
              'protocolAutoValuesNote',
              'Connectivity auto detection is currently enabled; setting values listed on this page are not being used',
            )}
            icon={IconConstants.INFO}
          />
        )}
        <RemoteSettingForm
          {...this.props}
          onFieldSetting={this.onFieldSetting}
          onSettingValuesReceived={this.onSettingValuesReceived}
          valueMode={API.SettingValueMode.FORCE_MANUAL}
        />
      </div>
    );
  }
}

export default ProtocolPage;
