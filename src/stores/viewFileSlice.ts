import * as API from 'types/api';
import * as UI from 'types/ui';

import { createSessionSlice } from './decorators/sessionSlice';
import { lens } from '@dhmk/zustand-lens';
import { ViewFileAPIActions } from 'actions/store/ViewFileActions';
import { createSessionScrollSlice } from './decorators/scrollSlice';
import ViewFileConstants from 'constants/ViewFileConstants';
import { createSessionSliceSocketListener } from './decorators/sliceSocketListener';

const createViewFileStore = (init: UI.StoreInitData) => {
  const addSocketListener = createSessionSliceSocketListener(
    init,
    ViewFileConstants.MODULE_URL,
    'view_file',
    API.AccessEnum.VIEW_FILE_VIEW,
  );

  return lens<UI.ViewFileStore, UI.Store>((...a) => ({
    ...createSessionSlice<API.ViewFile>(
      init,
      ViewFileAPIActions.setRead,
      addSocketListener,
    )(...a),
    scroll: createSessionScrollSlice(addSocketListener),
  }));
};

export const ViewFileStoreSelector: UI.SessionStoreSelector<API.ViewFile> = (state) =>
  state.viewFiles;

export default createViewFileStore;
