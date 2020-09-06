import { useMemo } from 'react';

import * as API from 'types/api';
import * as UI from 'types/ui';


export interface ItemDownloadManager {
  addDownloadItem: UI.AddItemDownload;
  downloadDialogProps: UI.ItemDownloadHandler;
}

export const useItemDownloadManager = (session: UI.SessionItemBase | undefined) => {
  const downloadManager = useMemo<ItemDownloadManager>(
    () => {
      const downloads: { [key in string]: UI.ItemDownloadHandler } = {};

      const getDownloadItem = (itemId: API.IdType) => {
        const item = downloads[itemId];
        if (!item) {
          throw new Error('Download was not found');
        }

        return item;
      };

      const ret: ItemDownloadManager = {
        downloadDialogProps: {
          downloadHandler: (itemInfo, user, downloadData, downloadSession) => {
            return getDownloadItem(itemInfo.id).downloadHandler(itemInfo, user, downloadData, downloadSession);
          },
          userGetter: (itemId, props) => {
            const userGetter = getDownloadItem(itemId).userGetter;
            return !!userGetter ? userGetter(itemId, props) : undefined;
          },
          itemDataGetter: (itemId, socket) => {
            return getDownloadItem(itemId).itemDataGetter(itemId, socket);
          },
          session
        },
        addDownloadItem: (itemId: string, itemDownloadHandler: UI.ItemDownloadHandler) => {
          downloads[itemId] = itemDownloadHandler;
        },
      };

      return ret;
    },
    []
  );

  return downloadManager;
};
