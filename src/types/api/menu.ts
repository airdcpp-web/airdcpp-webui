import { FormFieldDefinition } from '@/types/ui/form';

export type ContextMenuItemIconInfo = { [key in string]: string };

export interface ContextMenuItem {
  id: string;
  title: string;
  icon: ContextMenuItemIconInfo;
  hook_id: string;
  urls: string[];
  form_definitions?: FormFieldDefinition[];
  children?: ContextMenuItem[];
}

export interface GroupedContextMenu {
  id: string;
  title: string;
  icon: ContextMenuItemIconInfo;
  items: ContextMenuItem[];
}
