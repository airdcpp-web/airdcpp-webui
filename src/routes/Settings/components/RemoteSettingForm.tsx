import { useContext } from 'react';
import SettingConstants from 'constants/SettingConstants';

import DataProviderDecorator, {
  DataProviderDecoratorChildProps,
} from 'decorators/DataProviderDecorator';

import Form, {
  FormProps,
  FormSaveHandler,
  FormFieldChangeHandler,
} from 'components/form/Form';

import * as API from 'types/api';
import * as UI from 'types/ui';
import { SettingSaveContext, getSettingFormId } from '../effects/useSettingSaveContext';
import { useSocket } from 'context/SocketContext';

export interface RemoteSettingFormProps
  extends Omit<FormProps, 'onSave' | 'value' | 'fieldDefinitions' | 'location'> {
  keys: string[];
  onSettingValuesReceived?: (settings: API.SettingValueMap) => void;
  valueMode?: API.SettingValueMode;
}

interface RemoteSettingFormDataProps extends DataProviderDecoratorChildProps {
  settings: API.SettingValueMap;
  fieldDefinitions: UI.FormFieldDefinition[];
}

type Props = RemoteSettingFormProps & RemoteSettingFormDataProps;

const RemoteSettingForm: React.FC<Props> = ({
  onFieldChanged,
  refetchData,
  keys,
  fieldDefinitions,
  settings,
  ...other
}) => {
  const saveContext = useContext(SettingSaveContext)!;
  const socket = useSocket();

  const refetchValues = () => {
    refetchData(['settings']);
  };

  const onSave: FormSaveHandler<UI.FormValueMap> = (changedValues) => {
    if (Object.keys(changedValues).length === 0) {
      return Promise.resolve();
    }

    return socket.post(SettingConstants.ITEMS_SET_URL, changedValues).then(refetchValues);
  };

  const handleFieldChanged: FormFieldChangeHandler = (id, value, hasChanges) => {
    saveContext.onFieldChanged(id, value, hasChanges);
    if (onFieldChanged) {
      return onFieldChanged(id, value, hasChanges);
    }
  };

  return (
    <div className="remote setting-form">
      <Form
        {...other}
        id={getSettingFormId(keys)}
        ref={(f) => saveContext.addFormRef(keys, f)}
        onSave={onSave}
        fieldDefinitions={fieldDefinitions}
        sourceValue={settings}
        onFieldChanged={handleFieldChanged}
      />
    </div>
  );
};

export default DataProviderDecorator<RemoteSettingFormProps, RemoteSettingFormDataProps>(
  RemoteSettingForm,
  {
    urls: {
      fieldDefinitions: ({ keys }, socket) =>
        socket.post(SettingConstants.ITEMS_DEFINITIONS_URL, { keys }),
      settings: async (
        { keys, onSettingValuesReceived, valueMode = API.SettingValueMode.CURRENT },
        socket,
      ) => {
        const settings: API.SettingValueMap = await socket.post(
          SettingConstants.ITEMS_GET_URL,
          {
            keys,
            value_mode: valueMode,
          },
        );

        if (!!onSettingValuesReceived) {
          onSettingValuesReceived(settings);
        }

        return settings;
      },
    },
  },
);
