import { ErrorResponse } from 'airdcpp-apisocket';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export interface RefluxActionConfig<ItemDataT> {
  children?: string[];
  asyncResult?: boolean;
}

export type RefluxActionConfigList<ItemDataT> = Array<
  string | { [actionKey: string]: RefluxActionConfig<ItemDataT> }
>;

export type RefluxActionType<ItemDataT = any> = ((...params: any[]) => void) &
  RefluxActionConfig<ItemDataT>;

export type AsyncActionType<ItemDataT> = RefluxActionType<ItemDataT> & {
  completed: (...params: any[]) => void;
  failed: (error: ErrorResponse, item?: ItemDataT) => void;
};

export type RefluxActionListType<ItemDataT = any> = {
  [actionKey: string]: RefluxActionType<ItemDataT> | AsyncActionType<ItemDataT>;
};
