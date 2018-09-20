export const enum SettingTypeEnum {
  NUMBER = 'number',
  BOOLEAN = 'boolean',
  STRING = 'string',
  TEXT = 'text',
  FILE_PATH = 'file_path',
  DIRECTORY_PATH = 'directory_path',
  STRUCT = 'struct',
  LIST = 'list',
}

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
  type: SettingTypeEnum;
  item_type?: SettingTypeEnum;
  options?: SettingEnumOption[];
  min?: number;
  max?: number;
  default_value: SettingValueBase;
  definitions?: SettingDefinition[];
}

export type ConnectivityModeEnum = -1 | 0 | 1 | 2;