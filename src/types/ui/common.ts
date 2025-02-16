import { NavigateFunction, Location, Params } from 'react-router';
import * as API from 'types/api';

export type { TFunction as TranslateF } from 'i18next';
export interface SearchTypeItem {
  id: string | null;
  str: string;
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

export interface RouteComponentProps {
  navigate: NavigateFunction;
  location: Location;
}

export type RouteParams = Readonly<Params<string>>;

export type Callback = () => void;

export interface TranslatableMessage {
  id: string;
  message: string;
}
