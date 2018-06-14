declare namespace UI {
  export interface WidgetSettings<SettingsT = object> {
    widget: SettingsT;
    name: string;
  }

  export interface WidgetProps<SettingsT = object> {
    componentId: string;
    settings: SettingsT;
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
      actions: ActionType[];
      ids: string[];
    };
    formSettings?: UI.FormFieldDefinition[];
  }
}
  