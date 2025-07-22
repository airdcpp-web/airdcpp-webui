import { useContext, useMemo } from 'react';

import Form, {
  FormProps,
  FormSaveHandler,
  FormFieldChangeHandler,
} from '@/components/form/Form';

import * as UI from '@/types/ui';

import { translateForm } from '@/utils/FormUtils';
import { SettingSaveContext, getSettingFormId } from '../effects/useSettingSaveContext';
import { useAppStore, useAppStoreProperty } from '@/context/AppStoreContext';
import {
  getLocalSettingDefinitions,
  getLocalSettingValueMap,
} from '@/utils/LocalSettingUtils';

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
  const appStore = useAppStore();
  const storeSettingValues = useAppStoreProperty((state) => state.settings.settings);

  const value = useMemo(() => {
    return getLocalSettingValueMap(storeSettingValues);
  }, [storeSettingValues]);

  const definitions = useMemo(() => {
    return translateForm(getLocalSettingDefinitions(keys), moduleT);
  }, []);

  const saveContext = useContext(SettingSaveContext)!;

  const onSave: FormSaveHandler<UI.FormValueMap> = (changedSettingArray, allFields) => {
    appStore.settings.setValues(changedSettingArray);
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
        sourceValue={value}
        onFieldChanged={handleFieldChanged}
      />
    </div>
  );
};

export default LocalSettingForm;
