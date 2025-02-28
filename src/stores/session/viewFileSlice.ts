import * as API from '@/types/api';
import * as UI from '@/types/ui';

import { createSessionSlice, initSessionSlice } from './decorators/sessionSlice';
import { lens } from '@dhmk/zustand-lens';
import { ViewFileAPIActions } from '@/actions/store/ViewFileActions';
import {
  createSessionScrollSlice,
  initSessionScrollSlice,
} from './decorators/scrollSlice';
import ViewFileConstants from '@/constants/ViewFileConstants';
import { createSessionSliceSocketListener } from './decorators/sliceSocketListener';

const createViewFileStore = () => {
  return lens<UI.ViewFileStore, UI.SessionStore>((...a) => {
    const sessionSlice = createSessionSlice<API.ViewFile>()(...a);

    const scrollSlice = createSessionScrollSlice();
    return {
      ...sessionSlice,
      scroll: scrollSlice,
    };
  });
};

export const initViewFileStore = (
  sessionStore: UI.SessionStore,
  init: UI.SessionStoreInitData,
) => {
  // Init listeners
  const addSocketListener = createSessionSliceSocketListener(
    init,
    ViewFileConstants.MODULE_URL,
    'view_file',
    API.AccessEnum.VIEW_FILE_VIEW,
  );

  initSessionSlice(sessionStore.viewFiles, ViewFileAPIActions, addSocketListener);
  initSessionScrollSlice(sessionStore.viewFiles.scroll, addSocketListener);
};

export const ViewFileStoreSelector: UI.SessionStoreSelector<API.ViewFile> = (state) =>
  state.viewFiles;

export default createViewFileStore;
