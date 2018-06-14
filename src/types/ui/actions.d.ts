

declare namespace UI {
  export type ActionType = ((...params: any[]) => void) & {
    filter?: (itemData: any) => boolean;
    access?: string;
    displayName: string;
    icon?: string;
  }
}
  