import ViewFileConstants from '@/constants/ViewFileConstants';

import SessionActionDecorator from './decorators/SessionActionDecorator';

import * as API from '@/types/api';
import * as UI from '@/types/ui';
import { SessionCreatorDecorator } from './decorators/SessionCreatorDecorator';
import { APISocket } from '@/services/SocketService';

interface RemoteViewFileData {
  itemInfo: UI.DownloadableItemInfo;
  user: UI.DownloadSource | undefined;
  isText: boolean;
}

const createRemoteSession = SessionCreatorDecorator<API.ViewFile, RemoteViewFileData>({
  existingSessionGetter: ({ itemInfo }, store) =>
    store.viewFiles.getSession(itemInfo.tth),
  sectionUrlPath: '/files',
  createHandler: (data, socket) => {
    const { itemInfo, isText } = data;
    return socket.post<API.ViewFile>(ViewFileConstants.SESSIONS_URL, {
      user: data.user,
      tth: itemInfo.tth,
      size: itemInfo.size,
      name: itemInfo.name,
      text: isText,
    });
  },
});

const createLocalSession = SessionCreatorDecorator<API.ViewFile, RemoteViewFileData>({
  existingSessionGetter: ({ itemInfo }, store) =>
    store.viewFiles.getSession(itemInfo.tth),
  sectionUrlPath: '/files',
  createHandler: (data, socket) => {
    const { itemInfo, isText } = data;
    return socket.post<API.ViewFile>(
      `${ViewFileConstants.SESSIONS_URL}/${itemInfo.tth}`,
      {
        text: isText,
      },
    );
  },
});

const setRead = (session: UI.SessionItemBase, socket: APISocket) => {
  return socket.post(`${ViewFileConstants.SESSIONS_URL}/${session.id}/read`);
};

export const ViewFileAPIActions = {
  createRemoteSession,
  createLocalSession,
  setRead,
  ...SessionActionDecorator(ViewFileConstants.SESSIONS_URL),
};
