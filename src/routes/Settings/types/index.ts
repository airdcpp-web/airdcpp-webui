import * as API from '@/types/api';
import * as UI from '@/types/ui';

export type SettingSectionLayoutProps = Pick<UI.RouteComponentProps, 'location'> &
  React.PropsWithChildren<{
    contentClassname: string;
    selectedRootMenuItem: RootSectionType;
    selectedChildMenuItem: ChildSectionType;
    menu: {
      childMenuItems: React.ReactNode[];
      childAdvancedMenuItems?: React.ReactNode[];
      rootMenuItems: React.ReactNode[];
    };
    settingsT: UI.ModuleTranslator;
    message: React.ReactNode;
    getSaveButton: (className?: string) => React.ReactNode;
  }>;

export type SettingPageProps = React.PropsWithChildren<{
  settingsT: UI.ModuleTranslator;
  moduleT: UI.ModuleTranslator;
}>;

export interface SectionBase {
  url: string;
  access?: API.AccessEnum;
  title: string;
}

export interface ChildSectionType extends SectionBase {
  noSave?: boolean;
  local?: boolean;
  component: React.ComponentType<SettingPageProps>;
}

export interface RootSectionType extends SectionBase {
  menuItems: ChildSectionType[];
  advancedMenuItems?: ChildSectionType[];
  icon: string;
  component: React.ComponentType;
}
