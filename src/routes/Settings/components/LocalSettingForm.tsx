import { useContext, useMemo, useState } from 'react';

import LocalSettingStore from '@/stores/reflux/LocalSettingStore';

import Form, {
  FormProps,
  FormSaveHandler,
  FormFieldChangeHandler,
} from '@/components/form/Form';

import * as UI from '@/types/ui';

import { translateForm } from '@/utils/FormUtils';
import { SettingSaveContext, getSettingFormId } from '../effects/useSettingSaveContext';

export interface LocalSettingFormProps
  extends Omit<FormProps, 'onSave' | 'fieldDefinitions' | 'value' | 'location'> {
  keys: string[];
  moduleT: UI.ModuleTranslator;
}

const LocalSettingForm: React.FC<LocalSettingFormProps> = ({
  moduleT,
  keys,
  onFieldChanged,
}) => {
  const [settings, setSettings] = useState(LocalSettingStore.getValues());
  const definitions = useMemo(() => {
    return translateForm(LocalSettingStore.getDefinitions(keys), moduleT);
  }, []);

  const saveContext = useContext(SettingSaveContext)!;

  const onSave: FormSaveHandler<UI.FormValueMap> = (changedSettingArray, allFields) => {
    LocalSettingStore.setValues(changedSettingArray);
    setSettings(LocalSettingStore.getValues());
    return Promise.resolve();
  };

  const handleFieldChanged: FormFieldChangeHandler = (id, value, hasChanges) => {
    saveContext.onFieldChanged(id, value, hasChanges);
    if (onFieldChanged) {
      return onFieldChanged(id, value, hasChanges);
    }
  };

  return (
    <div className="local setting-form">
      <Form
        ref={(f) => saveContext.addFormRef(keys, f)}
        id={getSettingFormId(keys)}
        onSave={onSave}
        fieldDefinitions={definitions}
        sourceValue={settings}
        onFieldChanged={handleFieldChanged}
      />
    </div>
  );
};

export default LocalSettingForm;
