import { useMemo } from 'react';

import * as API from '@/types/api';
import * as UI from '@/types/ui';

export interface ItemDownloadManager<
  ItemT extends UI.DownloadableItemInfo,
  PropsT extends object,
> {
  addDownloadItem: UI.AddItemDownload<ItemT, PropsT>;
  downloadDialogProps: UI.ItemDownloadHandler<ItemT, PropsT>;
}

export const useItemDownloadManager = <
  ItemT extends UI.DownloadableItemInfo,
  PropsT extends object,
>(
  session: UI.SessionItemBase | undefined,
) => {
  const downloadManager = useMemo<ItemDownloadManager<ItemT, PropsT>>(() => {
    const downloads: { [key in string]: UI.ItemDownloadHandler<ItemT, PropsT> } = {};

    const getDownloadItem = (itemId: API.IdType) => {
      const item = downloads[itemId];
      if (!item) {
        throw new Error('Download was not found');
      }

      return item;
    };

    const ret: ItemDownloadManager<ItemT, PropsT> = {
      downloadDialogProps: {
        downloadHandler: (itemInfo, user, downloadData, downloadSession) => {
          return getDownloadItem(itemInfo.id).downloadHandler(
            itemInfo,
            user,
            downloadData,
            downloadSession,
          );
        },
        userGetter: (itemId, props) => {
          const userGetter = getDownloadItem(itemId).userGetter;
          return !!userGetter ? userGetter(itemId, props) : undefined;
        },
        itemDataGetter: (itemId, socket) => {
          return getDownloadItem(itemId).itemDataGetter(itemId, socket);
        },
        session,
      },
      addDownloadItem: (itemId, itemDownloadHandler) => {
        downloads[itemId] = itemDownloadHandler;
      },
    };

    return ret;
  }, []);

  return downloadManager;
};
