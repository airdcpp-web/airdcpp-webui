import * as API from 'types/api';
import { TranslateF } from './common';
import { IconType } from 'components/semantic/Icon';
import { Location, NavigateFunction } from 'react-router-dom';
import { MENU_DIVIDER } from 'constants/ActionConstants';
import { APISocket } from 'services/SocketService';

// ID is required for menu action item data due to extension hooks
export type ActionIdType = API.IdType | object; // Hinted user doesn't have a simple ID
export type ActionMenuObjectItemData = { id: ActionIdType };
export type ActionMenuItemDataValueType = ActionMenuObjectItemData | API.IdType | void;

export type ActionMenuItemEntityValueType = { id: API.IdType } | API.IdType | void;

export type ActionMenuItemDataType<ItemDataT extends ActionMenuItemDataValueType> =
  | (() => ItemDataT)
  | ItemDataT;

export type ActionDataValueType = object | API.IdType | void;
export type ActionEntityValueType = { id: API.IdType } | API.IdType | void;

export interface ActionConfirmation {
  content: string;
  approveCaption: string;
  rejectCaption?: string;
  checkboxCaption?: string;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
interface ActionInput<ItemDataT> extends ActionConfirmation {
  inputProps: React.InputHTMLAttributes<HTMLInputElement>;
}

export interface ActionHandlerData<
  ItemDataT extends ActionDataValueType,
  EntityType extends ActionDataValueType = void,
> {
  itemData: ItemDataT;
  entity: EntityType;
  location: Location;
  t: TranslateF;
  navigate: NavigateFunction;
  socket: APISocket;
}

export type ActionHandler<
  ItemDataT extends ActionDataValueType,
  EntityType extends ActionDataValueType = void,
> = (
  handlerData: ActionHandlerData<ItemDataT, EntityType>,
  confirmData?: boolean | string,
) => Promise<any> | void;

export interface FilterData<
  ItemDataT extends ActionDataValueType,
  EntityType extends ActionDataValueType = void,
> {
  itemData: ItemDataT;
  entity: EntityType;
}

export type ActionFilter<
  ItemDataT extends ActionDataValueType,
  EntityType extends ActionDataValueType = void,
> = (data: FilterData<ItemDataT, EntityType>) => boolean;

export interface ActionDefitionBase {
  id: string;
  displayName: string;
  icon?: string;
}

export interface ActionDefinition<
  ItemDataT extends ActionDataValueType,
  EntityT extends ActionEntityValueType = void,
> extends ActionDefitionBase {
  handler: ActionHandler<ItemDataT, EntityT>;
  filter?: ActionFilter<ItemDataT, EntityT>;
  checked?: (itemData: ItemDataT) => boolean;
  access?: string;
  displayName: string;
  icon?: string;

  confirmation?:
    | ((item: ItemDataT /*, t: ModuleTranslator*/) => ActionConfirmation)
    | ActionConfirmation;
  input?:
    | ((item: ItemDataT /*, t: ModuleTranslator*/) => ActionInput<ItemDataT>)
    | ActionInput<ItemDataT>;
  notifications?: {
    onSuccess?: string /*| ((data: ItemDataT) => string)*/;
    itemConverter?: (itemData: ItemDataT) => any;
    errorTitleGetter?: (itemData: ItemDataT) => string;
  };
}

export type MenuDivider = typeof MENU_DIVIDER;

export type ChildActionListType<
  ItemDataT extends ActionMenuItemDataValueType,
  EntityT extends ActionMenuItemEntityValueType,
> = {
  [actionKey: string]: ActionDefinition<ItemDataT, EntityT> | MenuDivider;
};

export interface GroupedActionDefition<
  ItemDataT extends ActionMenuItemDataValueType,
  EntityT extends ActionMenuItemEntityValueType,
> extends ActionDefitionBase {
  children: ChildActionListType<ItemDataT, EntityT>;
}

export type ActionListItemType<
  ItemDataT extends ActionMenuItemDataValueType,
  EntityT extends ActionMenuItemEntityValueType,
> =
  | ActionDefinition<ItemDataT, EntityT>
  | GroupedActionDefition<ItemDataT, EntityT>
  | MenuDivider;

export type ActionListType<
  ItemDataT extends ActionMenuItemDataValueType,
  EntityT extends ActionMenuItemEntityValueType = void,
> = {
  [actionKey: string]: ActionListItemType<ItemDataT, EntityT>;
};

export interface ActionModuleData {
  moduleId: string | string[];
  subId?: string;
}

export interface ModuleActions<
  ItemDataT extends ActionMenuItemDataValueType,
  EntityT extends ActionMenuItemEntityValueType = void,
  ActionsT extends ActionListType<ItemDataT, EntityT> = ActionListType<
    ItemDataT,
    EntityT
  >,
> {
  actions: ActionsT;
  moduleData: ActionModuleData;
}

interface MenuItemBase {
  icon?: IconType;
  disabled?: boolean;
}
export interface ActionMenuItemType extends MenuItemBase {
  onClick: (evt: React.SyntheticEvent<any>) => void;
  active?: boolean;
  children: React.ReactNode;
}

export interface ActionMenuItem {
  id: string;
  item?: ActionMenuItemType;
  children?: ActionMenuItem[];
}

export type ActionMenuComponentBuilder = (
  items: ActionMenuItem[],
  onClickItem?: () => void,
) => React.ReactNode;
