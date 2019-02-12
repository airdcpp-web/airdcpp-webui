import * as API from 'types/api';
import { RouteComponentProps } from 'react-router';
import { WithTranslation } from 'react-i18next';

export type FormValueBase = API.SettingValueBase | object;
export type FormValue = API.SettingValue<FormValueBase>;
export type FormValueMap = API.SettingValueMap<FormValueBase | {}>;


export interface FormFieldDefinition<ValueType = FormValueBase> extends 
  Omit<API.SettingDefinition, 'default_value' | 'definitions'> {
    
  default_value?: FormValueBase;
  definitions?: FormFieldDefinition[];
}

export interface FormOption<OptionValueT = any> {
  value: OptionValueT;
  text: string;
}

export type FormContext = Pick<RouteComponentProps, 'location'> & Pick<WithTranslation, 't'>;

export type FormLocals<OptionValueT = any, ValueT = any, ConfigT = undefined> = {
  onChange: (values: ValueT) => void,
  options: Array<FormOption<OptionValueT>>,
  value: ValueT,
  config: ConfigT,
  context: FormContext,
  label?: string,
};
