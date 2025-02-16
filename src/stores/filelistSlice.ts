import * as API from 'types/api';
import * as UI from 'types/ui';

import { createSessionSlice } from './decorators/sessionSlice';
import { lens } from '@dhmk/zustand-lens';
import { FilelistAPIActions } from 'actions/store/FilelistActions';
import { createSessionScrollSlice } from './decorators/scrollSlice';
import FilelistConstants from 'constants/FilelistConstants';
import { createSessionSliceSocketListener } from './decorators/sliceSocketListener';

const createFilelistStore = (init: UI.StoreInitData) => {
  const addSocketListener = createSessionSliceSocketListener(
    init,
    FilelistConstants.MODULE_URL,
    'filelist',
    API.AccessEnum.FILELISTS_VIEW,
  );

  const slice = lens<UI.FilelistStore, UI.Store>((...a) => ({
    ...createSessionSlice<API.FilelistSession>(
      init,
      FilelistAPIActions.setRead,
      addSocketListener,
    )(...a),
    scroll: createSessionScrollSlice(addSocketListener),
  }));

  return slice;
};

export const FilelistStoreSelector: UI.SessionStoreSelector<API.FilelistSession> = (
  state,
) => state.filelists;

export default createFilelistStore;
