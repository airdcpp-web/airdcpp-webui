import { FormFieldDefinition } from './form';
import { ModuleActions } from './actions';
import { ModuleTranslator } from './modules';

export interface WidgetSettings<SettingsT = Record<string, any>> {
  widget: SettingsT;
  name?: string;
}

export interface WidgetProps<SettingsT = object> {
  componentId: string;
  settings: SettingsT;
  widgetT: ModuleTranslator;
  rootWidgetT: ModuleTranslator;
  //toWidgetI18nKey: (key?: string) => string;
}

export interface Widget {
  typeId: string;
  component: React.ComponentType<WidgetProps>;
  access?: string;
  alwaysShow?: boolean;
  name: string;
  icon: string;
  size: {
    w: number;
    h: number;
    minH: number;
    minW: number;
  };
  actionMenu?: {
    actions: ModuleActions<void>;
    ids: string[];
  };
  formSettings?: FormFieldDefinition[];
}
