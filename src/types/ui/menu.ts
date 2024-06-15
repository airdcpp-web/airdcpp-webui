import {
  ActionMenuItemDataType,
  ActionMenuItemDataValueType,
  ActionDefinition,
  ModuleActions,
  ActionDefitionBase,
  MenuDivider,
  ActionModuleData,
  ActionDataValueType,
  ActionEntityValueType,
  ActionMenuItemEntityValueType,
} from './actions';

export interface ActionMenuData<
  ItemDataT extends ActionMenuItemDataValueType,
  EntityT extends ActionMenuItemEntityValueType,
> {
  ids?: string[];
  actions: ModuleActions<ItemDataT, EntityT>;
  itemData?: ActionMenuItemDataType<ItemDataT>;
  entity?: EntityT;
}

export type MenuItemClickHandler = () => void;

export type ActionMenuFilterType<
  ItemDataT extends ActionMenuItemDataValueType,
  EntityT extends ActionMenuItemEntityValueType,
> = (
  action: ActionDefinition<ItemDataT, EntityT>,
  itemData: ItemDataT,
  entity: EntityT,
) => boolean;

export type IdActionType = { id: string };

export type MenuActionDefition<
  ItemDataT extends ActionDataValueType,
  EntityT extends ActionEntityValueType,
> = ActionDefinition<ItemDataT, EntityT> & IdActionType;

export type ChildMenuActionListType<
  ItemDataT extends ActionMenuItemDataValueType,
  EntityT extends ActionEntityValueType,
> = Array<MenuActionDefition<ItemDataT, EntityT> | MenuDivider>;

export interface GroupedMenuActionDefition<
  ItemDataT extends ActionMenuItemDataValueType,
  EntityT extends ActionEntityValueType,
> extends ActionDefitionBase,
    IdActionType {
  children: ChildMenuActionListType<ItemDataT, EntityT>;
}

export type MenuActionListItemType<
  ItemDataT extends ActionMenuItemDataValueType,
  EntityT extends ActionEntityValueType,
> =
  | GroupedMenuActionDefition<ItemDataT, EntityT>
  | MenuActionDefition<ItemDataT, EntityT>
  | MenuDivider;

export type MenuActionListType<
  ItemDataT extends ActionMenuItemDataValueType,
  EntityT extends ActionEntityValueType,
> = Array<MenuActionListItemType<ItemDataT, EntityT>>;

export interface ActionMenuType<
  ItemDataT extends ActionMenuItemDataValueType,
  EntityT extends ActionEntityValueType,
> {
  itemDataGetter: () => ItemDataT;
  entity: EntityT;
  moduleData: ActionModuleData;
  actions: MenuActionListType<ItemDataT, EntityT>;
}
