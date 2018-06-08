declare namespace API {
  export type SettingType = 'number' | 'string' | 'file_path' | 'directory_path' | 'text' | 'struct' | 'boolean' | 'list';
  export interface SettingEnumOption {
    id: number | string;
    name: string;
  }

  export interface SettingValueMap<ValueType = API.SettingValueBase> {
    [key: string]: ValueType;
  }

  export type SettingValueBase = number | string | boolean;

  export type SettingValue<ValueType = API.SettingValueBase> = ValueType[] | ValueType | SettingValueMap<ValueType>;

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
    default_value: SettingValue;
    definitions?: SettingDefinition[];
  }
}