import { APISocket } from 'services/SocketService';
import * as API from 'types/api';
import * as UI from 'types/ui';


export interface DownloadSource extends API.HintedUserBase {
  flags: API.HubUserFlag[];
}

export type DownloadHandler<ItemT extends DownloadableItemInfo> = (
  itemInfo: ItemT, 
  user: DownloadSource | undefined, 
  downloadData: API.DownloadData,
  session: UI.SessionItemBase | undefined,
) => Promise<any>;

export interface DownloadableItemInfo {
  id: API.IdType;
  name: string;
  tth: string;
  size: number;
  type: API.FileItemType;
  path: string | undefined;
  dupe: API.Dupe | null;
  time: number | undefined;
}

export interface DownloadableItemData<ItemT extends DownloadableItemInfo = DownloadableItemInfo> {
  id: API.IdType;
  itemInfo: ItemT;
  user: DownloadSource | undefined;
  handler: DownloadHandler<ItemT>;
  session: UI.SessionItemBase | undefined;
}

type DownloadItemIdType = string;

export type DownloadUserGetter<PropsT extends object> = (
  itemId: DownloadItemIdType, 
  props: PropsT
) => UI.DownloadSource | undefined;

export type DownloadItemDataGetter<ItemT extends UI.DownloadableItemInfo> = (
  itemId: DownloadItemIdType, 
  socket: APISocket
) => Promise<ItemT>;

export interface ItemDownloadHandler<
  ItemT extends UI.DownloadableItemInfo = UI.DownloadableItemInfo, 
  PropsT extends object = UI.EmptyObject
> {
  downloadHandler: UI.DownloadHandler<ItemT>;
  session: UI.SessionItemBase | undefined;
  itemDataGetter: DownloadItemDataGetter<ItemT>;
  userGetter?: DownloadUserGetter<PropsT>;
}

export type AddItemDownload<
  ItemT extends UI.DownloadableItemInfo = UI.DownloadableItemInfo, 
  PropsT extends object = UI.EmptyObject
> = (
  itemId: string | number, 
  handler: ItemDownloadHandler<ItemT, PropsT>
) => void;
