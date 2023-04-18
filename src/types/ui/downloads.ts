import { APISocket } from 'services/SocketService';
import * as API from 'types/api';
import { SessionItemBase } from './sessions';
import { EmptyObject } from './common';

export interface DownloadSource extends API.HintedUserBase {
  flags: API.HubUserFlag[];
}

export type DownloadHandler<ItemT extends DownloadableItemInfo> = (
  itemInfo: ItemT,
  user: DownloadSource | undefined,
  downloadData: API.DownloadData,
  session: SessionItemBase | undefined
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

export interface DownloadableItemData<
  ItemT extends DownloadableItemInfo = DownloadableItemInfo
> {
  id: API.IdType;
  itemInfo: ItemT;
  user: DownloadSource | undefined;
  handler: DownloadHandler<ItemT>;
  session: SessionItemBase | undefined;
}

type DownloadItemIdType = string;

export type DownloadUserGetter<PropsT extends object> = (
  itemId: DownloadItemIdType,
  props: PropsT
) => DownloadSource | undefined;

export type DownloadItemDataGetter<ItemT extends DownloadableItemInfo> = (
  itemId: DownloadItemIdType,
  socket: APISocket
) => Promise<ItemT>;

export interface ItemDownloadHandler<
  ItemT extends DownloadableItemInfo = DownloadableItemInfo,
  PropsT extends object = EmptyObject
> {
  downloadHandler: DownloadHandler<ItemT>;
  session: SessionItemBase | undefined;
  itemDataGetter: DownloadItemDataGetter<ItemT>;
  userGetter?: DownloadUserGetter<PropsT>;
}

export type AddItemDownload<
  ItemT extends DownloadableItemInfo = DownloadableItemInfo,
  PropsT extends object = EmptyObject
> = (itemId: string | number, handler: ItemDownloadHandler<ItemT, PropsT>) => void;
