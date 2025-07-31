import FilelistConstants from '@/constants/FilelistConstants';

import { APISocket } from '@/services/SocketService';

import SessionActionDecorator from './decorators/SessionActionDecorator';
import { getFilePath } from '@/utils/FileUtils';

import * as API from '@/types/api';
import * as UI from '@/types/ui';

import {
  changeFilelistHubUrl,
  changeFilelistShareProfile,
  changeFilelistDirectory,
} from '@/services/api/FilelistApi';
import { SessionCreatorDecorator } from './decorators/SessionCreatorDecorator';

interface CreateRemoteSessionData {
  user: UI.ActionUserType;
  path?: string;
}

const createRemoteSession = SessionCreatorDecorator<
  API.FilelistSession,
  CreateRemoteSessionData
>({
  existingSessionGetter: ({ user }, sessionStore) =>
    sessionStore.filelists.getSession(user.cid),
  sectionUrlPath: '/filelists',
  onExists: (session, { user, path = '/' }, socket) => {
    if (user.hub_url && session.user.hub_url !== user.hub_url) {
      changeFilelistHubUrl(session, user.hub_url, socket);
    }

    const directory = getFilePath(path);
    if (directory !== '/' && (!session.location || session.location.path !== directory)) {
      changeFilelistDirectory(session, directory, socket);
    }
  },
  createHandler: (data, socket) => {
    const { user, path = '/' } = data;
    const directory = getFilePath(path);
    return socket.post<API.FilelistSession>(FilelistConstants.SESSIONS_URL, {
      user: {
        cid: user.cid,
        hub_url: user.hub_url,
      },
      directory,
    });
  },
});

interface CreateLocalSessionData {
  shareProfileId: number;
}

const initCreateLocalSession = (filelist: UI.AuthenticatedSession) =>
  SessionCreatorDecorator<API.FilelistSession, CreateLocalSessionData>({
    existingSessionGetter: (data, sessionStore) =>
      sessionStore.filelists.getSession(filelist.system_info.cid),
    onExists: (filelist, { shareProfileId }, socket) => {
      if (filelist.share_profile!.id !== shareProfileId) {
        changeFilelistShareProfile(filelist, shareProfileId, socket);
      }
    },
    sectionUrlPath: '/filelists',
    createHandler: ({ shareProfileId }, socket) => {
      return socket.post<API.FilelistSession>(`${FilelistConstants.SESSIONS_URL}/self`, {
        share_profile: shareProfileId,
      });
    },
  });

// SESSION UPDATES

const setRead = (filelist: UI.SessionItemBase, socket: APISocket) => {
  return socket.post(`${FilelistConstants.SESSIONS_URL}/${filelist.id}/read`);
};

export const FilelistAPIActions = {
  createRemoteSession,
  initCreateLocalSession,
  setRead,
  ...SessionActionDecorator(FilelistConstants.SESSIONS_URL),
};
