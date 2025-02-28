import { FormValueBase, FormValueMap } from './form';

export type LocalSettingValues = FormValueMap;

export interface LocalSettingsSlice {
  settings: LocalSettingValues;

  init(): void;

  getValue<ValueType extends FormValueBase>(key: string): ValueType;
  setValue(key: string, value: FormValueBase): void;
  setValues(items: Partial<LocalSettingValues>): void;
}

export interface AppStore {
  settings: LocalSettingsSlice;
}
