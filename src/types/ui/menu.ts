import * as API from 'types/api';
import {
  ActionMenuItemDataType,
  ActionMenuItemDataValueType,
  ActionType,
  ModuleActions,
} from './actions';

export interface ActionMenuData<ItemDataT extends ActionMenuItemDataValueType> {
  ids?: string[];
  actions: ModuleActions<ItemDataT>;
  itemData?: ActionMenuItemDataType<ItemDataT>;
  entityId?: API.IdType;
}

export type MenuItemClickHandler = () => void;

export type ActionMenuFilterType<ItemDataT extends ActionMenuItemDataValueType> = (
  action: ActionType<ItemDataT>,
  itemData: ItemDataT,
) => boolean;

export interface ActionMenuType<ItemDataT> {
  actionIds: string[];
  itemDataGetter: () => ItemDataT;
  actions: ModuleActions<ItemDataT>;
}
