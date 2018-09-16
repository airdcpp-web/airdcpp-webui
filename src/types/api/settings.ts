export type SettingType = 'number' | 'string' | 'file_path' | 'directory_path' | 'text' | 'struct' | 'boolean' | 'list';

export interface SettingEnumOption {
  id: number | string;
  name: string;
}

export interface SettingValueMap<ValueType = SettingValueBase> {
  [key: string]: ValueType | ValueType[];
}

//export type SettingValueBase = number | string | boolean;
//export type SettingValueBaseNullable = SettingValueBase | null;
export type SettingValueBase = number | string | boolean | null;

export type SettingValue<ValueType = SettingValueBase> = ValueType[] | ValueType | SettingValueMap<ValueType>;

export interface SettingDefinition {
  key: string;
  title: string;
  help?: string;
  optional?: boolean;
  type: SettingType;
  item_type?: SettingType;
  options?: SettingEnumOption[];
  min?: number;
  max?: number;
  default_value: SettingValueBase;
  definitions?: SettingDefinition[];
}

export type ConnectivityModeEnum = -1 | 0 | 1 | 2;