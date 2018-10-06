import { ErrorResponse } from 'airdcpp-apisocket';

export type ActionItemDataValueType = object | string | number;
export type ActionItemDataType = (() => ActionItemDataValueType) | ActionItemDataValueType;


export interface ActionConfig<ItemDataT> {
  filter?: (itemData: ItemDataT) => boolean;
  access?: string;
  displayName?: string;
  icon?: string;
  children?: string[];
  asyncResult?: boolean;
}

export type ActionType<ItemDataT = any> = ((...params: any[]) => void) & ActionConfig<ItemDataT>;

export type AsyncActionType<ItemDataT> = ActionType<ItemDataT> & {
  completed: (...params: any[]) => void;
  failed: (error: ErrorResponse, item?: ItemDataT) => void;
};

export type EditorActionType<ItemDataT> = ActionType<ItemDataT> & {
  saved: (...params: any[]) => void;
};

export type ConfirmActionType<ItemDataT> = ActionType<ItemDataT> & {
  confirmed: (...params: any[]) => void;
};

export type ActionConfigList<ItemDataT> = Array<string | { [actionKey: string]: ActionConfig<ItemDataT> }>;
