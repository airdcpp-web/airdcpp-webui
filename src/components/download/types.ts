import * as UI from 'types/ui';


export type BrowseHandler = (() => void) | undefined;

export type PathDownloadHandler = (targetPath: string, targetFilename?: string) => Promise<any>;

export type LayoutProps = React.PropsWithChildren<{
  menuItems: React.ReactNode[];
  title: string;
  handleBrowse: BrowseHandler;
  t: UI.TranslateF;
}>;
