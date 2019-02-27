import { Location } from 'history';

import { ErrorResponse } from 'airdcpp-apisocket';
//import { ModuleTranslator } from './modules';

export type ActionItemDataValueType = object | string | number | undefined;
export type ActionItemDataType<ItemDataT extends ActionItemDataValueType> = (() => ItemDataT) | ItemDataT;


export interface ActionConfirmation {
  content: string;
  approveCaption: string;
  rejectCaption?: string;
  checkboxCaption?: string;
}

interface ActionInput<ItemDataT> extends ActionConfirmation {
  inputProps: React.InputHTMLAttributes<HTMLInputElement>;
}

interface HandlerData<ItemDataT> {
  data: ItemDataT;
  location: Location;
}

export type ActionHandler<ItemDataT> = (
  handlerData: HandlerData<ItemDataT>, 
  confirmData?: boolean | string
) => Promise<any> | void;

export interface ActionType<ItemDataT> {
  handler: ActionHandler<ItemDataT>;
  filter?: (itemData: ItemDataT) => boolean;
  access?: string;
  displayName: string;
  icon: string;

  confirmation?: ((item: ItemDataT /*, t: ModuleTranslator*/) => ActionConfirmation) | ActionConfirmation;
  input?: ((item: ItemDataT /*, t: ModuleTranslator*/) => ActionInput<ItemDataT>) | ActionInput<ItemDataT>;
}

export interface RefluxActionConfig<ItemDataT> {
  children?: string[];
  asyncResult?: boolean;
}

export type RefluxActionType<ItemDataT = any> = ((...params: any[]) => void) & RefluxActionConfig<ItemDataT>;

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

export type RefluxActionConfigList<ItemDataT> = Array<string | { [actionKey: string]: RefluxActionConfig<ItemDataT> }>;

export type ActionListType<ItemDataT> = { [actionKey: string]: ActionType<ItemDataT> | null };

export type RefluxActionListType<ItemDataT = any> = { 
  [actionKey: string]: RefluxActionType | AsyncActionType<ItemDataT>
};


export interface ModuleActions<ItemDataT> {
  moduleId: string | string[];
  subId?: string;
  actions: ActionListType<ItemDataT>;
}
