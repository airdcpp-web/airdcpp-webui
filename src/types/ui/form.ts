import * as API from 'types/api';

export type FormValueBase = API.SettingValueBase;
export type FormValue = API.SettingValue<FormValueBase>;
export type FormValueMap = API.SettingValueMap<FormValueBase>;

export interface FormFieldDefinition<ValueType = FormValueBase> extends 
  Omit<API.SettingDefinition, 'title' | 'default_value'> {
    
  title?: string;
  default_value?: FormValueBase;
}

export interface FormOption<OptionValueT = any> {
  value: OptionValueT;
  text: string;
} 

export type FormLocals<OptionValueT = any, ValueT = any> = {
  onChange: (values: ValueT) => void,
  options: Array<FormOption>,
  value: ValueT,
};
