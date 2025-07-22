import * as API from '@/types/api';
import * as UI from '@/types/ui';

import { createSessionSlice, initSessionSlice } from './decorators/sessionSlice';
import { lens } from '@dhmk/zustand-lens';
import { FilelistAPIActions } from '@/actions/store/FilelistActions';
import {
  createSessionScrollSlice,
  initSessionScrollSlice,
} from './decorators/scrollSlice';
import FilelistConstants from '@/constants/FilelistConstants';
import { createSessionSliceSocketListener } from './decorators/sliceSocketListener';

const createFilelistStore = () => {
  const slice = lens<UI.FilelistStore, UI.SessionStore>((...a) => {
    const sessionSlice = createSessionSlice<API.FilelistSession>()(...a);
    const scrollSlice = createSessionScrollSlice();

    return {
      ...sessionSlice,
      scroll: scrollSlice,
    };
  });

  return slice;
};

export const initFilelistStore = (
  sessionStore: UI.SessionStore,
  init: UI.SessionStoreInitData,
) => {
  // Init listeners
  const addSocketListener = createSessionSliceSocketListener(
    init,
    FilelistConstants.MODULE_URL,
    'filelist',
    API.AccessEnum.FILELISTS_VIEW,
  );

  initSessionSlice(sessionStore.filelists, FilelistAPIActions, addSocketListener);
  initSessionScrollSlice(sessionStore.viewFiles.scroll, addSocketListener);
};

export const FilelistStoreSelector: UI.SessionStoreSelector<API.FilelistSession> = (
  state,
) => state.filelists;

export default createFilelistStore;
