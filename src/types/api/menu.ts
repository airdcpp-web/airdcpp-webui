export type ContextMenuItemIconInfo = { [key in string]: string };

export interface ContextMenuItem {
  id: string;
  title: string;
  icon: ContextMenuItemIconInfo;
  hook_id: string;
  urls: string[];
}