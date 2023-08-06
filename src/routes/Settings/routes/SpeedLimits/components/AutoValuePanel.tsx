import PropTypes from 'prop-types';
import { Component } from 'react';
import RemoteSettingForm from 'routes/Settings/components/RemoteSettingForm';

import SocketService from 'services/SocketService';
import SettingConstants from 'constants/SettingConstants';
import { FormFieldChangeHandler, FormFieldSettingHandler } from 'components/form/Form';

import * as API from 'types/api';

interface AutoValuePanelProps {
  type: string;
  keys: string[];
}

class AutoValuePanel extends Component<AutoValuePanelProps> {
  static propTypes = {
    // Form items to list
    keys: PropTypes.array.isRequired,

    // Type of the value section (from the setting key)
    type: PropTypes.string.isRequired,
  };

  getAutoKey = () => {
    return `${this.props.type}_auto_limits`;
  };

  // Fetch auto settings when enabling auto detection
  onFieldChanged: FormFieldChangeHandler = (changedKey, formValue, hasChanges) => {
    const autoSettingKey = this.getAutoKey();
    if (changedKey !== autoSettingKey || !formValue[autoSettingKey]) {
      return null;
    }

    return SocketService.post(SettingConstants.ITEMS_GET_URL, {
      keys: this.props.keys.filter((key) => key !== autoSettingKey),
      value_mode: API.SettingValueMode.FORCE_AUTO,
    });
  };

  // Disable other fields when auto detection is enabled
  onFieldSetting: FormFieldSettingHandler<any> = (
    settingKey,
    fieldOptions,
    formValue,
  ) => {
    if (formValue[this.getAutoKey()] && settingKey !== this.getAutoKey()) {
      fieldOptions.disabled = true;
    }
  };

  render() {
    const { keys } = this.props;
    return (
      <div className="ui segment">
        <RemoteSettingForm
          keys={keys}
          onFieldChanged={this.onFieldChanged}
          onFieldSetting={this.onFieldSetting}
        />
      </div>
    );
  }
}

export default AutoValuePanel;
