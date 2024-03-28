import * as API from 'types/api';
import { TranslateF } from './common';
import { IconType } from 'components/semantic/Icon';
import { Location, NavigateFunction } from 'react-router-dom';
import { MENU_DIVIDER } from 'constants/ActionConstants';

export type ActionIdType = API.IdType | object;
export type ActionMenuObjectItemData = { id: ActionIdType };
export type ActionMenuItemDataValueType =
  | ActionMenuObjectItemData
  | string
  | number
  | undefined;
export type ActionMenuItemDataType<ItemDataT extends ActionMenuItemDataValueType> =
  | (() => ItemDataT)
  | ItemDataT;

export type ActionItemDataValueType = object | string | number | undefined;

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

export interface ActionHandlerData<ItemDataT> {
  data: ItemDataT;
  location: Location;
  t: TranslateF;
  navigate: NavigateFunction;
}

export type ActionHandler<ItemDataT> = (
  handlerData: ActionHandlerData<ItemDataT>,
  confirmData?: boolean | string,
) => Promise<any> | void;

export interface ActionDefitionBase {
  displayName: string;
  icon?: string;
}

export interface ActionDefinition<ItemDataT> extends ActionDefitionBase {
  handler: ActionHandler<ItemDataT>;
  filter?: (itemData: ItemDataT) => boolean;
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

export type ChildActionListType<ItemDataT> = {
  [actionKey: string]: ActionDefinition<ItemDataT> | MenuDivider;
};

export interface GroupedActionDefition<ItemDataT> extends ActionDefitionBase {
  children: ChildActionListType<ItemDataT>;
}

export type ActionListItemType<ItemDataT> =
  | ActionDefinition<ItemDataT>
  | GroupedActionDefition<ItemDataT>
  | MenuDivider;

export type ActionListType<ItemDataT> = {
  [actionKey: string]: ActionListItemType<ItemDataT>;
};

export interface ModuleActions<
  ItemDataT,
  ActionsT extends ActionListType<ItemDataT> = ActionListType<ItemDataT>,
> {
  moduleId: string | string[];
  subId?: string;
  actions: ActionsT;
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
