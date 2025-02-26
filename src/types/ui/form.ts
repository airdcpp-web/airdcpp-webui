import * as API from '@/types/api';
import { ModuleTranslator } from './modules';
import tcomb from '@/utils/tcomb-form';
import { EmptyObject } from './common';

export type FormObjectValue = Record<string, any>;
export type FormValueBase = API.SettingValueBase | FormObjectValue;
export type FormValue = API.SettingValue<FormValueBase>;
export type FormValueMap = API.SettingValueMap<FormValueBase | EmptyObject>;

export interface FormFieldDefinition
  extends Omit<API.SettingDefinition, 'default_value' | 'definitions'> {
  default_value?: FormValueBase;
  definitions?: FormFieldDefinition[];
}

export interface FormOption<OptionValueT = string | number> {
  value: OptionValueT;
  text: string;
}

export const enum TranslatableFormDefinitionProperties {
  HELP = 'Help',
  NAME = 'Name',
  OPTION = 'Option',
}

export type FormContext = {
  // location: Location;
  formT: ModuleTranslator;
};

export type FormLocals<
  OptionValueT = any,
  ValueT = any,
  ConfigT = undefined,
> = tcomb.form.TemplateLocals<OptionValueT, ValueT, ConfigT>;

export type OptionTitleParser = (
  definition: FormFieldDefinition,
  formT: ModuleTranslator,
) => React.ReactNode;
