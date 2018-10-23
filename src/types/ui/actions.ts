import { ErrorResponse } from 'airdcpp-apisocket';

export type ActionItemDataValueType = object | string | number | undefined;
export type ActionItemDataType<ItemDataT extends ActionItemDataValueType> = (() => ItemDataT) | ItemDataT;



export interface ActionConfirmation {
  content: string;
  approveCaption?: string;
  rejectCaption?: string;
  checkboxCaption?: string;
}

interface ActionInput<ItemDataT> extends ActionConfirmation {
  inputProps: React.InputHTMLAttributes<HTMLInputElement>;
}

export interface ActionConfig<ItemDataT> {
  filter?: (itemData: ItemDataT) => boolean;
  access?: string;
  displayName?: string;
  icon?: string;
  children?: string[];
  asyncResult?: boolean;
  confirmation?: ((item: ItemDataT) => ActionConfirmation) | ActionConfirmation;
  input?: ((item: ItemDataT) => ActionInput<ItemDataT>) | ActionInput<ItemDataT>;
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

export type ActionListType<ItemDataT> = { [actionKey: string]: ActionType<ItemDataT> };
