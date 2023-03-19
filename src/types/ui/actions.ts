import { Location } from 'history';

import { ErrorResponse } from 'airdcpp-apisocket';

import * as API from 'types/api';
import { TranslateF } from './common';

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
  //chain: (action: ActionType)
}

export type ActionHandler<ItemDataT> = (
  handlerData: ActionHandlerData<ItemDataT>,
  confirmData?: boolean | string
) => Promise<any> | void;

export interface ActionType<ItemDataT> {
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
    onSuccess?: string /*| ((data: any) => string)*/;
    errorTitleGetter?: (itemData: ItemDataT) => string;
  };
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export interface RefluxActionConfig<ItemDataT> {
  children?: string[];
  asyncResult?: boolean;
}

export type RefluxActionType<ItemDataT = any> = ((...params: any[]) => void) &
  RefluxActionConfig<ItemDataT>;

export type AsyncActionType<ItemDataT> = RefluxActionType<ItemDataT> & {
  completed: (...params: any[]) => void;
  failed: (error: ErrorResponse, item?: ItemDataT) => void;
};

/*export type EditorActionType<ItemDataT> = ActionType<ItemDataT> & {
  saved: (...params: any[]) => void;
};*/

/*export type ConfirmActionType<ItemDataT> = ActionType<ItemDataT> & {
  confirmed: (...params: any[]) => void;
};*/

//type GenericActionType<ItemDataT> = AsyncActionType<ItemDataT> &
//  EditorActionType<ItemDataT> &
//  ConfirmActionType<ItemDataT>;

export type RefluxActionConfigList<ItemDataT> = Array<
  string | { [actionKey: string]: RefluxActionConfig<ItemDataT> }
>;

export type ActionListType<ItemDataT> = {
  [actionKey: string]: ActionType<ItemDataT> | null;
};

export type RefluxActionListType<ItemDataT = any> = {
  [actionKey: string]: RefluxActionType<ItemDataT> | AsyncActionType<ItemDataT>;
};

export interface ModuleActions<
  ItemDataT,
  ActionsT extends ActionListType<ItemDataT> = ActionListType<ItemDataT>
> {
  moduleId: string | string[];
  subId?: string;
  actions: ActionsT;
}
