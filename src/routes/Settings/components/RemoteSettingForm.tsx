import { Component } from 'react';
import SettingConstants from 'constants/SettingConstants';

import DataProviderDecorator, {
  DataProviderDecoratorChildProps,
} from 'decorators/DataProviderDecorator';
import SocketService from 'services/SocketService';

import Form, {
  FormProps,
  FormSaveHandler,
  FormFieldChangeHandler,
} from 'components/form/Form';

import * as API from 'types/api';
import * as UI from 'types/ui';
import { withSaveContext, SaveContextProps } from '../decorators/SaveDecorator';
import { RouteComponentProps } from 'react-router';

export interface RemoteSettingFormProps
  extends Omit<FormProps, 'onSave' | 'value' | 'fieldDefinitions'> {
  keys: string[];
  onSettingValuesReceived?: (settings: API.SettingValueMap) => void;
  valueMode?: API.SettingValueMode;
}

interface RemoteSettingFormDataProps extends DataProviderDecoratorChildProps {
  settings: API.SettingValueMap;
  fieldDefinitions: UI.FormFieldDefinition[];
}

type Props = RemoteSettingFormProps &
  RemoteSettingFormDataProps &
  SaveContextProps &
  RouteComponentProps;

class RemoteSettingForm extends Component<Props> {
  onSave: FormSaveHandler<UI.FormValueMap> = (changedValues) => {
    if (Object.keys(changedValues).length === 0) {
      return Promise.resolve();
    }

    return SocketService.post(SettingConstants.ITEMS_SET_URL, changedValues).then(
      this.refetchValues
    );
  };

  refetchValues = () => {
    this.props.refetchData(['settings']);
  };

  onFieldChanged: FormFieldChangeHandler = (id, value, hasChanges) => {
    const { saveContext, onFieldChanged } = this.props;
    saveContext.onFieldChanged(id, value, hasChanges);
    if (onFieldChanged) {
      return onFieldChanged(id, value, hasChanges);
    }
  };

  render() {
    const { settings, fieldDefinitions, saveContext, keys, ...otherProps } = this.props;
    return (
      <div className="remote setting-form">
        <Form
          {...otherProps}
          ref={(f) => saveContext.addFormRef(keys, f)}
          onSave={this.onSave}
          fieldDefinitions={fieldDefinitions}
          sourceValue={settings}
          onFieldChanged={this.onFieldChanged}
        />
      </div>
    );
  }
}

export default DataProviderDecorator<RemoteSettingFormProps, RemoteSettingFormDataProps>(
  withSaveContext(RemoteSettingForm),
  {
    urls: {
      fieldDefinitions: ({ keys }) =>
        SocketService.post(SettingConstants.ITEMS_DEFINITIONS_URL, { keys }),
      settings: async ({
        keys,
        onSettingValuesReceived,
        valueMode = API.SettingValueMode.CURRENT,
      }) => {
        const settings: API.SettingValueMap = await SocketService.post(
          SettingConstants.ITEMS_GET_URL,
          {
            keys,
            value_mode: valueMode,
          }
        );

        if (!!onSettingValuesReceived) {
          onSettingValuesReceived(settings);
        }

        return settings;
      },
    },
  }
);
