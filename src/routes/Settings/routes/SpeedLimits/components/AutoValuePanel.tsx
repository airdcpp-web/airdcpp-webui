import RemoteSettingForm from 'routes/Settings/components/RemoteSettingForm';

import SocketService from 'services/SocketService';
import SettingConstants from 'constants/SettingConstants';
import { FormFieldChangeHandler, FormFieldSettingHandler } from 'components/form/Form';

import * as API from 'types/api';

interface AutoValuePanelProps {
  // Type of the value section (from the setting key)
  type: string;

  // Form items to list
  keys: string[];
}

const AutoValuePanel: React.FC<AutoValuePanelProps> = ({ type, keys }) => {
  const getAutoKey = () => {
    return `${type}_auto_limits`;
  };

  // Fetch auto settings when enabling auto detection
  const onFieldChanged: FormFieldChangeHandler = (changedKey, formValue, hasChanges) => {
    const autoSettingKey = getAutoKey();
    if (changedKey !== autoSettingKey || !formValue[autoSettingKey]) {
      return null;
    }

    return SocketService.post(SettingConstants.ITEMS_GET_URL, {
      keys: keys.filter((key) => key !== autoSettingKey),
      value_mode: API.SettingValueMode.FORCE_AUTO,
    });
  };

  // Disable other fields when auto detection is enabled
  const onFieldSetting: FormFieldSettingHandler<any> = (
    settingKey,
    fieldOptions,
    formValue,
  ) => {
    if (formValue[getAutoKey()] && settingKey !== getAutoKey()) {
      fieldOptions.disabled = true;
    }
  };

  return (
    <div className="ui segment">
      <RemoteSettingForm
        keys={keys}
        onFieldChanged={onFieldChanged}
        onFieldSetting={onFieldSetting}
      />
    </div>
  );
};

export default AutoValuePanel;
