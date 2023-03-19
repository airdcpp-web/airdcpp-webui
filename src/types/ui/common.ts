import * as API from 'types/api';

export type { TFunction as TranslateF } from 'i18next';
export interface SearchTypeItem {
  id: string | null;
  str: string;
}

export interface ScrollPositionHandler {
  getScrollData: (id?: API.IdType) => number | undefined;
  setScrollData: (data: number | undefined, id?: API.IdType) => void;
}

export enum FileSelectModeEnum {
  FILE,
  DIRECTORY,
  EXISTING_FILE,
}

export interface IdItemType {
  id: API.IdType;
}

export type EmptyObject = Record<string, never>;

export type PropsWithChildren = {
  children: React.ReactNode;
};
