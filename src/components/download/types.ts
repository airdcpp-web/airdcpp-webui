// import * as API from 'types/api';

import { TFunction } from 'i18next';


export type BrowseHandler = (() => void) | undefined;

export type PathDownloadHandler = (targetPath: string, targetFilename?: string) => Promise<any>;

export interface LayoutProps {
  menuItems: React.ReactNode[];
  title: string;
  handleBrowse: BrowseHandler;
  t: TFunction;
}
