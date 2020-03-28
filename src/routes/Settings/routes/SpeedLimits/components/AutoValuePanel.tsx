import PropTypes from 'prop-types';
import React from 'react';
import RemoteSettingForm from 'routes/Settings/components/RemoteSettingForm';

import SocketService from 'services/SocketService';
import SettingConstants from 'constants/SettingConstants';
import { SettingSectionChildProps } from 'routes/Settings/components/SettingSection';
import { FormFieldChangeHandler, FormFieldSettingHandler } from 'components/form/Form';

import * as API from 'types/api';


interface AutoValuePanelProps extends SettingSectionChildProps {
  type: string;
  keys: string[];
}

class AutoValuePanel extends React.Component<AutoValuePanelProps> {
  static propTypes = {
    // Form items to list
    keys: PropTypes.array.isRequired,

    // Type of the value section (from the setting key)
    type: PropTypes.string.isRequired,
  };

  getAutoKey = () => {
    return `${this.props.type}_auto_limits`;
  }

  // Fetch auto settings when enabling auto detection
  onFieldChanged: FormFieldChangeHandler = (changedKey, formValue, hasChanges) => {
    const autoSettingKey = this.getAutoKey();
    if (changedKey !== autoSettingKey || !formValue[autoSettingKey]) {
      return null;
    }

    return SocketService.post(SettingConstants.ITEMS_GET_URL, { 
      keys: this.props.keys.filter(key => key !== autoSettingKey), 
      value_mode: API.SettingValueMode.FORCE_AUTO,
    });
  }

  // Disable other fields when auto detection is enabled
  onFieldSetting: FormFieldSettingHandler<any> = (settingKey, fieldOptions, formValue) => {
    if (formValue[this.getAutoKey()] && settingKey !== this.getAutoKey()) {
      fieldOptions.disabled = true;
    }
  }

  render() {
    return (
      <div className="ui segment">
        <RemoteSettingForm
          { ...this.props }
          onFieldChanged={ this.onFieldChanged }
          onFieldSetting={ this.onFieldSetting }
        />
      </div>
    );
  }
}

export default AutoValuePanel;