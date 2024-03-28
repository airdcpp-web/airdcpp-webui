import {
  ActionMenuItemDataType,
  ActionMenuItemDataValueType,
  ActionDefinition,
  ModuleActions,
  ActionDefitionBase,
} from './actions';

export interface ActionMenuData<ItemDataT extends ActionMenuItemDataValueType> {
  ids?: string[];
  actions: ModuleActions<ItemDataT>;
  itemData?: ActionMenuItemDataType<ItemDataT>;
}

export type MenuItemClickHandler = () => void;

export type ActionMenuFilterType<ItemDataT extends ActionMenuItemDataValueType> = (
  action: ActionDefinition<ItemDataT>,
  itemData: ItemDataT,
) => boolean;

export type IdActionType = { id: string };

export type MenuActionDefition<ItemDataT> = ActionDefinition<ItemDataT> & IdActionType;

export type ChildMenuActionListType<ItemDataT> =
  Array<MenuActionDefition<ItemDataT> | null>;

export interface GroupedMenuActionDefition<ItemDataT>
  extends ActionDefitionBase,
    IdActionType {
  children: ChildMenuActionListType<ItemDataT>;
}

export type MenuActionListItemType<ItemDataT> =
  | GroupedMenuActionDefition<ItemDataT>
  | MenuActionDefition<ItemDataT>
  | null;

export type MenuActionListType<ItemDataT> = Array<MenuActionListItemType<ItemDataT>>;

export interface ActionMenuType<ItemDataT> {
  itemDataGetter: () => ItemDataT;
  actions: {
    moduleId: string | string[];
    subId?: string;
    actions: MenuActionListType<ItemDataT>;
  };
}
