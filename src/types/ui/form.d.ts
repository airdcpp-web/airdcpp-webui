declare namespace UI {
  export type FormValueBase = API.SettingValueBase;
  export type FormValue = API.SettingValue<FormValueBase>;
  export type FormValueMap = API.SettingValueMap<FormValueBase>;

  export interface FormFieldDefinition<ValueType = FormValueBase> extends Omit<API.SettingDefinition<FormValueBase>, 'title' | 'default_value'> {
    title?: string;
    default_value?: FormValueBase;
  }
}
