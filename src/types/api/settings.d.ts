declare namespace API {
  export type SettingType = 'number' | 'string' | 'file_path' | 'directory_path' | 'text' | 'struct' | 'boolean' | 'list';
  export interface SettingEnumOption {
    id: number | string;
    name: string;
  }

  export interface SettingValueMap<ValueType = API.SettingValueBase> {
    [key: string]: ValueType | ValueType[];
  }

  export type SettingValueBase = number | string | boolean | null;

  export type SettingValue<ValueType = API.SettingValueBase> = ValueType[] | ValueType | SettingValueMap<ValueType>;

  export interface SettingDefinition<ValueType = SettingValueBase> {
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
}