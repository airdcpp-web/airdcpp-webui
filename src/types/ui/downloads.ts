import * as API from 'types/api';
import * as UI from 'types/ui';

export type DownloadHandler<ItemT extends DownloadableItemInfo> = (
  itemInfo: ItemT, 
  user: API.HintedUserBase | undefined, 
  downloadData: API.DownloadData,
  session: UI.SessionItemBase,
) => Promise<any>;

export interface DownloadableItemInfo {
  id: API.IdType;
  name: string;
  tth: string;
  size: number;
  type: API.FileItemType;
  path: string;
  dupe: API.Dupe;
  time: number;
}

export interface DownloadableItemData<ItemT extends DownloadableItemInfo = DownloadableItemInfo> {
  id: API.IdType;
  itemInfo: ItemT;
  user: API.HintedUser;
  handler: DownloadHandler<ItemT>;
  session: UI.SessionItemBase;
}

export type PathDownloadHandler = (path: string) => Promise<any>;
