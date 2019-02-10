import * as API from 'types/api';

export type FormValueBase = API.SettingValueBase | object;
export type FormValue = API.SettingValue<FormValueBase>;
export type FormValueMap = API.SettingValueMap<FormValueBase | {}>;


export interface FormFieldDefinition<ValueType = FormValueBase> extends 
  Omit<API.SettingDefinition, 'title' | 'default_value' | 'definitions'> {
    
  title?: string;
  titleKey?: string;
  default_value?: FormValueBase;
  definitions?: FormFieldDefinition[];
}

export interface FormOption<OptionValueT = any> {
  value: OptionValueT;
  text: string;
} 

export type FormLocals<OptionValueT = any, ValueT = any> = {
  onChange: (values: ValueT) => void,
  options: Array<FormOption<OptionValueT>>,
  value: ValueT,
};
