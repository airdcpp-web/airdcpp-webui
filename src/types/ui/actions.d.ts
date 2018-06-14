

declare namespace UI {
  export interface ActionType {
    filter?: (itemData: any) => boolean;
    access?: string;
    displayName: string;
  }
}
  