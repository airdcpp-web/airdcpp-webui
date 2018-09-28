export type ActionItemDataValueType = object | string | number;
export type ActionItemDataType = (() => ActionItemDataValueType) | ActionItemDataValueType;

export type ActionType<ItemDataT = any> = ((...params: any[]) => void) & {
  filter?: (itemData: ItemDataT) => boolean;
  access?: string;
  displayName: string;
  icon?: string;
  confirmed?: any;
};
  